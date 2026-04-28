import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/card';
import {
  Check,
  Zap,
  Crown,
  Code2,
  Users,
  Clock,
  Shield,
  Sparkles,
  TrendingUp,
  ArrowLeft,
  Loader2
} from 'lucide-react';
// import { toast } from '../../../../packages/ui/src/hooks/use-toast';
// import { BACKENDURL } from '../utils/urls';
import type { RootState } from '../state/ReduxStateProvider';
// import { setUserDetails } from '../state/ReduxStateProvider';

declare global {
  interface Window {
    Razorpay: any;
  }
}

// const loadRazorpayScript = (): Promise<boolean> => {
//   return new Promise((resolve) => {
//     if (window.Razorpay) {
//       resolve(true);
//       return;
//     }
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve(true);
//     script.onerror = () => resolve(false);
//     document.body.appendChild(script);
//   });
// };

export default function PricingPage() {
  const navigate = useNavigate();
  // const dispatch = useDispatch<AppDispatch>();
  const userDetails = useSelector((state: RootState) => state.userDetails);
  // const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPlan, ] = useState<string | null>(null);

  const isSubscriber = userDetails?.user?.isSubscriber;
  const currentPlan = userDetails?.user?.subscriptionPlan;

  // const handleSubscribe = async (planKey: string, planName: string) => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     toast({
  //       title: "Authentication Required",
  //       description: "Please sign in to subscribe",
  //       variant: "destructive",
  //     });
  //     navigate("/auth");
  //     return;
  //   }

  //   setLoadingPlan(planKey);

  //   try {
  //     // Load Razorpay checkout script
  //     const scriptLoaded = await loadRazorpayScript();
  //     if (!scriptLoaded) {
  //       toast({
  //         title: "Error",
  //         description: "Failed to load payment gateway. Please try again.",
  //         variant: "destructive",
  //       });
  //       setLoadingPlan(null);
  //       return;
  //     }

  //     // Create subscription on backend
  //     const createRes = await fetch(`${BACKENDURL}/subscription/create`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         token: token,
  //       },
  //       body: JSON.stringify({ planKey }),
  //     });

  //     const createData = await createRes.json();

  //     if (!createRes.ok || !createData.success) {
  //       toast({
  //         title: "Error",
  //         description: createData.message || "Failed to create subscription",
  //         variant: "destructive",
  //       });
  //       setLoadingPlan(null);
  //       return;
  //     }

  //     const { subscription } = createData;

  //     // Open Razorpay Checkout
  //     const options = {
  //       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  //       subscription_id: subscription.razorpaySubscriptionId,
  //       name: "Grind",
  //       description: `${planName} Plan — Monthly Subscription`,
  //       image: "/new_logo.jpg",
  //       handler: async (response: any) => {
  //         try {
  //           // Verify payment on backend
  //           const verifyRes = await fetch(`${BACKENDURL}/subscription/verify`, {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //               token: token,
  //             },
  //             body: JSON.stringify({
  //               razorpay_payment_id: response.razorpay_payment_id,
  //               razorpay_subscription_id: response.razorpay_subscription_id,
  //               razorpay_signature: response.razorpay_signature,
  //             }),
  //           });

  //           const verifyData = await verifyRes.json();

  //           if (verifyRes.ok && verifyData.success) {
  //             // Update Redux state
  //             dispatch(
  //               setUserDetails({
  //                 isSubscriber: true,
  //                 subscriptionPlan: verifyData.planName,
  //               })
  //             );

  //             toast({
  //               title: "🎉 Welcome to Premium!",
  //               description: `Your ${verifyData.planName} plan is now active. Enjoy all premium features!`,
  //             });

  //             navigate("/premium");
  //           } else {
  //             toast({
  //               title: "Verification Failed",
  //               description: verifyData.message || "Payment verification failed. Contact support.",
  //               variant: "destructive",
  //             });
  //           }
  //         } catch {
  //           toast({
  //             title: "Error",
  //             description: "Payment was received but verification failed. Contact support.",
  //             variant: "destructive",
  //           });
  //         }
  //         setLoadingPlan(null);
  //       },
  //       modal: {
  //         ondismiss: () => {
  //           setLoadingPlan(null);
  //         },
  //       },
  //       theme: {
  //         color: "#6366f1",
  //       },
  //     };

  //     const rzpInstance = new window.Razorpay(options);
  //     rzpInstance.on("payment.failed", (response: any) => {
  //       console.error("Payment failed:", response.error);
  //       toast({
  //         title: "Payment Failed",
  //         description: response.error?.description || "Payment could not be processed. Please try again.",
  //         variant: "destructive",
  //       });
  //       setLoadingPlan(null);
  //     });
  //     rzpInstance.open();
  //   } catch (err) {
  //     console.error("Subscription error:", err);
  //     toast({
  //       title: "Error",
  //       description: "Something went wrong. Please try again.",
  //       variant: "destructive",
  //     });
  //     setLoadingPlan(null);
  //   }
  // };

  const plans = [
    {
      key: 'basic',
      name: 'Basic',
      price: '199',
      description: 'Perfect for individual developers',
      icon: Code2,
      color: 'blue',
      features: [
        'Access to 500+ coding problems',
        'Basic Grind AI assistance',
        'Personal code compiler',
        'Progress tracking',
        'Community support',
        'Monthly contests access'
      ],
      popular: false
    },
    {
      key: 'pro',
      name: 'Pro',
      price: '499',
      description: 'For serious competitive programmers',
      icon: Crown,
      color: 'purple',
      features: [
        'Everything in Basic',
        'Unlimited Grind AI queries',
        'Advanced problem analytics',
        'Private coding rooms',
        'Priority support',
        'Exclusive weekly contests',
        'Interview preparation module',
        'Custom problem creation'
      ],
      popular: true
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <div className="h-8 w-8 overflow-hidden rounded-lg border border-border/60 bg-background p-0.5 shadow-sm">
                <img
                  src="/new_logo.jpg"
                  alt="Grind logo"
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
              <span className="text-lg font-bold">Grind</span>
            </div>
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Problem
            </Button>
          </div>
        </div>
      </header>

      <main className="container flex-1 px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Simple & Transparent Pricing
            </div>
            <h1 className="text-5xl font-bold mb-4">
              Choose Your
              <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {' '}Grind Plan
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock your full potential with our premium features. Start grinding today!
            </p>

            {isSubscriber && (
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold">
                <Check className="h-4 w-4" />
                You're on the {currentPlan} plan
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              const isCurrentPlan = isSubscriber && currentPlan === plan.name;
              const isLoading = loadingPlan === plan.key;

              return (
                <Card 
                  key={plan.name}
                  className={`relative border-2 ${
                    plan.popular 
                      ? 'border-purple-500/50 shadow-lg shadow-purple-500/20 scale-105' 
                      : 'border-border/40'
                  } bg-card/50 backdrop-blur transition-all hover:shadow-xl`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <Crown className="h-3 w-3" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${
                      plan.color === 'blue' 
                        ? 'from-blue-500/20 to-cyan-500/20' 
                        : 'from-purple-500/20 to-pink-500/20'
                    } flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className={`h-8 w-8 ${
                        plan.color === 'blue' ? 'text-blue-500' : 'text-purple-500'
                      }`} />
                    </div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {plan.description}
                    </CardDescription>
                    <div className="mt-6">
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-5xl font-bold">₹{plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className={`h-5 w-5 rounded-full ${
                            plan.color === 'blue' 
                              ? 'bg-blue-500/10' 
                              : 'bg-purple-500/10'
                          } flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className={`h-3 w-3 ${
                              plan.color === 'blue' ? 'text-blue-500' : 'text-purple-500'
                            }`} />
                          </div>
                          <span className="text-sm text-foreground/90">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600' 
                          : ''
                      }`}
                      size="lg"
                      variant={plan.popular ? 'default' : 'outline'}
                      // onClick={() => handleSubscribe(plan.key, plan.name)}
                      disabled={isCurrentPlan || isLoading || !!loadingPlan}
                    >
                      {isCurrentPlan ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Current Plan
                        </>
                      ) : isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : plan.popular ? (
                        <>
                          <Zap className="mr-2 h-4 w-4" />
                          Get Started
                        </>
                      ) : (
                        'Choose Plan'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <Card className="border-border/40 bg-card/50 backdrop-blur text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-semibold mb-2">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is protected with enterprise-grade security
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-semibold mb-2">10K+ Active Users</h3>
                <p className="text-sm text-muted-foreground">
                  Join thousands of developers improving their skills
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur text-center">
              <CardContent className="pt-6">
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-2">95% Success Rate</h3>
                <p className="text-sm text-muted-foreground">
                  Our users report significant skill improvement
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-16 text-center">
            <Card className="border-border/40 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur">
              <CardContent className="py-8">
                <h3 className="text-2xl font-bold mb-2">Still have questions?</h3>
                <p className="text-muted-foreground mb-6">
                  Our team is here to help you choose the right plan
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" size="lg">
                    Contact Support
                  </Button>
                  <Button size="lg">
                    <Clock className="mr-2 h-4 w-4" />
                    Start Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}