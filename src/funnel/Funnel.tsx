import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckoutModal } from '../components/CheckoutModal'
import { FunnelLayout } from '../components/FunnelLayout'
import {
  buildStepOrder,
  clearFunnelState,
  loadFunnelState,
  saveFunnelState,
  UPSELL_STEPS,
  type FunnelAnswers,
  type FunnelStep,
  type UpsellStep,
} from '../lib/funnelState'
import {
  stepToHistoryState,
  stepToUrl,
  urlToStep,
} from '../lib/funnelUrls'
import type { Plan } from '../lib/plans'
import { DEFAULT_PLAN_ID } from '../lib/plans'
import { setCurrentStep, track } from '../lib/track'
import { AccountScreen } from '../screens/AccountScreen'
import { AnalyzingScreen } from '../screens/AnalyzingScreen'
import { EmailGateScreen } from '../screens/EmailGateScreen'
import { GenderQuizScreen } from '../screens/GenderQuizScreen'
import { LandingScreen } from '../screens/LandingScreen'
import { LocationScreen, DEFAULT_LOCATION } from '../screens/LocationScreen'
import { OfferScreen } from '../screens/OfferScreen'
import { PhotoUploadScreen } from '../screens/PhotoUploadScreen'
import { QuizScreen } from '../screens/QuizScreen'
import { ThankYouScreen } from '../screens/ThankYouScreen'
import { SearchQueuedScreen } from '../screens/SearchQueuedScreen'
import { UpsellScreen } from '../screens/UpsellScreen'
import { UPSELLS, type UpsellId } from '../data/upsellContent'
import { useVariant } from '../variant/useVariant'

const QUIZ_STEPS: FunnelStep[] = ['quiz_gender', 'quiz_age', 'quiz_name', 'quiz_location', 'photo']

const UPSELL_STEP_TO_ID: Record<UpsellStep, UpsellId> = {
  upsell_radius: 'radius',
  upsell_apps: 'apps',
  upsell_tracker: 'tracker',
  upsell_priority: 'priority',
  upsell_credits: 'credits',
  upsell_people: 'people',
  upsell_sexoffender: 'sexoffender',
  upsell_criminal: 'criminal',
  upsell_bundle: 'bundle',
}

function isUpsellStep(step: FunnelStep): step is UpsellStep {
  return (UPSELL_STEPS as FunnelStep[]).includes(step)
}

// Next screen after a given upsell step: the following upsell, or the queued confirmation.
function nextAfterUpsell(step: UpsellStep): FunnelStep {
  const i = UPSELL_STEPS.indexOf(step)
  return UPSELL_STEPS[i + 1] ?? 'queued'
}

const QUIZ_STARTED_KEY = 'cs_quiz_started'

function isValidAge(value: string) {
  const age = parseInt(value.trim(), 10)
  return !isNaN(age) && age >= 18 && age <= 99
}

// Mirrors live: banner appears while typing, hidden when the field is empty.
function ageErrorForValue(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const age = parseInt(trimmed, 10)
  if (isNaN(age) || age < 18) return 'Age must be 18 or older to proceed'
  if (age > 99) return 'Age must be 99 or younger to proceed'
  return null
}

function isValidName(value: string) {
  return value.trim().length > 0
}

function getStepInputValue(
  key: 'gender' | 'age' | 'name' | 'location',
  answers: FunnelAnswers,
  viaBack: boolean,
): string {
  if (key === 'location') {
    return viaBack ? (answers.location ?? DEFAULT_LOCATION) : DEFAULT_LOCATION
  }
  return viaBack ? (answers[key] ?? '') : ''
}

export function Funnel() {
  const location = useLocation()
  const navigate = useNavigate()

  const { changes } = useVariant()

  // change1 ON  → pictures → full scanning animation → email gate (value before ask)
  // change1 OFF → pictures → email gate → scanning (mirrors the live site)
  const emailBeforeAnalyzing = !changes.change1

  const stepOrder = useMemo(
    () => buildStepOrder(emailBeforeAnalyzing),
    [emailBeforeAnalyzing],
  )

  const step = useMemo(
    () => urlToStep(location.pathname, location.search, location.state) ?? 'landing',
    [location.pathname, location.search, location.state],
  )

  const [answers, setAnswers] = useState<FunnelAnswers>(() => ({
    selectedPlanId: DEFAULT_PLAN_ID,
    ...loadFunnelState().answers,
  }))
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [purchasedPlan, setPurchasedPlan] = useState<Plan | null>(null)
  const prevStepRef = useRef<FunnelStep | null>(null)
  const restoreValuesRef = useRef(false)

  if (prevStepRef.current !== step) {
    if (prevStepRef.current !== null) {
      const prevIndex = stepOrder.indexOf(prevStepRef.current)
      const currIndex = stepOrder.indexOf(step)

      if (prevIndex !== -1 && currIndex !== -1) {
        restoreValuesRef.current = currIndex < prevIndex
      } else if (step === 'landing') {
        restoreValuesRef.current = true
      } else if (prevStepRef.current === 'landing') {
        restoreValuesRef.current = false
      }
    } else {
      restoreValuesRef.current = false
    }
    prevStepRef.current = step
  }

  const restoreValues = restoreValuesRef.current

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('restart') !== '1') return

    clearFunnelState()
    sessionStorage.removeItem(QUIZ_STARTED_KEY)
    setCheckoutOpen(false)
    setPurchasedPlan(null)
    setAnswers({ selectedPlanId: DEFAULT_PLAN_ID })
    prevStepRef.current = null
    restoreValuesRef.current = false
    params.delete('restart')
    navigate(stepToUrl('landing', params.toString()), { replace: true })
  }, [location.search, navigate])

  useEffect(() => {
    if (location.pathname !== '/quiz') return
    const params = new URLSearchParams(location.search)
    if (!params.get('qs')) {
      params.set('qs', 'gender')
      navigate(`/quiz?${params}`, { replace: true })
    }
  }, [location.pathname, location.search, navigate])

  // Every funnel screen fires funnel_step_view; the step also rides along on
  // every other event via setCurrentStep.
  useEffect(() => {
    setCurrentStep(step)
    track('funnel_step_view')

    if (QUIZ_STEPS.includes(step) && !sessionStorage.getItem(QUIZ_STARTED_KEY)) {
      sessionStorage.setItem(QUIZ_STARTED_KEY, '1')
      track('quiz_started')
    }
  }, [step])

  useEffect(() => {
    saveFunnelState(step, answers)
  }, [step, answers])

  const navigateToStep = useCallback(
    (nextStep: FunnelStep) => {
      navigate(stepToUrl(nextStep, location.search), {
        state: stepToHistoryState(nextStep),
      })
    },
    [location.search, navigate],
  )

  const goToNext = useCallback(
    (nextAnswers?: Partial<FunnelAnswers>) => {
      if (nextAnswers) setAnswers((current) => ({ ...current, ...nextAnswers }))

      if (QUIZ_STEPS.includes(step)) {
        track('quiz_step_completed', { quiz_step: step })
      }

      const currentIndex = stepOrder.indexOf(step)
      const nextStep = stepOrder[currentIndex + 1]
      if (nextStep) navigateToStep(nextStep)
    },
    [navigateToStep, step, stepOrder],
  )

  const goToPrevious = useCallback(() => {
    if (checkoutOpen) {
      setCheckoutOpen(false)
      return
    }
    if (step === 'quiz_gender') {
      navigate(stepToUrl('landing', location.search), { replace: false })
      return
    }
    if (step === 'quiz_age') {
      navigate(stepToUrl('quiz_gender', location.search))
      return
    }
    if (stepOrder.indexOf(step) > 0) {
      navigate(-1)
    }
  }, [checkoutOpen, location.search, navigate, step, stepOrder])

  const handleGetAccess = () => {
    const offerIndex = stepOrder.indexOf('offer')
    if (offerIndex >= 0) navigateToStep('offer')
  }

  const handleCheckout = (source: string) => {
    track('checkout_initiated', { source, planId: answers.selectedPlanId })
    setCheckoutOpen(true)
  }

  const handlePurchaseSuccess = (plan: Plan) => {
    setPurchasedPlan(plan)
    setCheckoutOpen(false)
    // Live flow: payment success drops straight into the upsell sequence.
    navigateToStep('upsell_radius')
  }

  const renderStep = () => {
    if (isUpsellStep(step)) {
      const advance = () => navigateToStep(nextAfterUpsell(step))
      return (
        <UpsellScreen
          key={step}
          config={UPSELLS[UPSELL_STEP_TO_ID[step]]}
          onAccept={advance}
          onDecline={advance}
        />
      )
    }

    switch (step) {
      case 'landing':
        return null

      case 'quiz_gender':
        return (
          <GenderQuizScreen
            key={`gender-${restoreValues}`}
            defaultValue={getStepInputValue('gender', answers, restoreValues)}
            onSubmit={(gender) => goToNext({ gender })}
          />
        )

      case 'quiz_age':
        return (
          <QuizScreen
            key={`age-${restoreValues}`}
            question="How old are they?"
            step={2}
            inputPlaceholder="Enter their age"
            defaultValue={getStepInputValue('age', answers, restoreValues)}
            factoid={{
              title: 'Did you know?',
              body: '43% of people on dating apps are actively in relationships according to the New York Times.',
            }}
            onBack={goToPrevious}
            onSubmit={(age) => goToNext({ age })}
            canProceed={isValidAge}
            errorForValue={ageErrorForValue}
          />
        )

      case 'quiz_name':
        return (
          <QuizScreen
            key={`name-${restoreValues}`}
            question="What is their name?"
            step={3}
            inputPlaceholder="First Name (Required)"
            defaultValue={getStepInputValue('name', answers, restoreValues)}
            factoid={{
              title: 'Did you know?',
              body: 'CheaterScanner boasts a 99.6% accuracy rate across Tinder, Bumble, and Hinge, helping you catch cheaters with confidence. We are not affiliated with Tinder, Bumble, or Hinge. All trademarks are property of their respective owners. We only use publicly available information and never use unauthorized scraping or automated access.',
              desktopLines: [
                'CheaterScanner boasts a 99.6% accuracy rate across Tinder, Bumble, and Hinge,',
                'helping you catch cheaters with confidence. We are not affiliated with Tinder, Bumble, or Hinge. All trademarks are property of their respective owners. We only use publicly available information and never use unauthorized scraping or automated access.',
              ],
            }}
            onBack={goToPrevious}
            onSubmit={(name) => goToNext({ name })}
            canProceed={isValidName}
            lockNextButton
          />
        )

      case 'quiz_location':
        return (
          <LocationScreen
            key={`location-${restoreValues}`}
            step={4}
            defaultValue={getStepInputValue('location', answers, restoreValues)}
            onBack={goToPrevious}
            onSubmit={(location) => goToNext({ location })}
          />
        )

      case 'photo':
        return (
          <PhotoUploadScreen
            step={5}
            partnerName={answers.name || 'Unknown'}
            defaultEmail={answers.email}
            loadingBeforeEmail={changes.change1}
            onBack={goToPrevious}
            onContinue={(uploaded) => goToNext({ photoUploaded: uploaded })}
            onEmailSubmit={(email) => {
              setAnswers((current) => ({ ...current, email }))
              navigateToStep('offer')
            }}
          />
        )

      case 'analyzing':
        return (
          <AnalyzingScreen
            onComplete={(scanResult) => {
              setAnswers((current) => ({ ...current, scanResult }))
              navigateToStep(answers.email ? 'offer' : 'email')
            }}
          />
        )

      case 'email':
        return (
          <EmailGateScreen
            defaultEmail={answers.email}
            scanResult={emailBeforeAnalyzing ? undefined : answers.scanResult}
            onSubmit={(email) => goToNext({ email })}
            onBack={goToPrevious}
          />
        )

      case 'offer':
        return (
          <OfferScreen
            selectedPlanId={answers.selectedPlanId ?? DEFAULT_PLAN_ID}
            partnerName={answers.name}
            partnerAge={answers.age}
            partnerLocation={answers.location}
            onPlanSelect={(planId) =>
              setAnswers((current) => ({ ...current, selectedPlanId: planId }))
            }
            onCheckout={handleCheckout}
          />
        )

      case 'thank_you':
        return (
          <ThankYouScreen
            planName={purchasedPlan?.name ?? '2 Searches'}
            onContinue={() => navigateToStep('upsell_radius')}
          />
        )

      case 'queued':
        return <SearchQueuedScreen onContinue={() => navigateToStep('account')} />

      case 'account':
        return (
          <AccountScreen
            email={answers.email ?? 'abc@gmail.com'}
            onComplete={() => {
              /* end of funnel */
            }}
          />
        )

      default:
        return null
    }
  }

  const showTopBar =
    step !== 'analyzing' && step !== 'landing' && !QUIZ_STEPS.includes(step)

  const checkoutModal = (
    <CheckoutModal
      isOpen={checkoutOpen}
      onClose={() => setCheckoutOpen(false)}
      onSuccess={handlePurchaseSuccess}
      selectedPlanId={answers.selectedPlanId ?? DEFAULT_PLAN_ID}
      email={answers.email ?? 'abc@gmail.com'}
      walletFirst={changes.change4}
    />
  )

  if (step === 'landing') {
    return (
      <>
        <LandingScreen
          onSelect={(gender) => {
            setAnswers((a) => ({ ...a, gender }))
            navigate(stepToUrl('quiz_gender', location.search), { replace: true })
            navigate(stepToUrl('quiz_age', location.search))
          }}
        />
        {checkoutModal}
      </>
    )
  }

  return (
    <>
      {QUIZ_STEPS.includes(step) ||
      step === 'analyzing' ||
      step === 'email' ||
      step === 'offer' ||
      isUpsellStep(step) ? (
        renderStep()
      ) : (
        <FunnelLayout onGetAccess={handleGetAccess} showTopBar={showTopBar}>
          {renderStep()}
          {step === 'account' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-white/70">End of funnel demo</p>
              <a href="/?restart=1" className="text-sm text-white underline">
                Restart funnel
              </a>
            </div>
          )}
        </FunnelLayout>
      )}

      {checkoutModal}
    </>
  )
}
