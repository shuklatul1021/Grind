import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { ArrowLeft, RefreshCw, SquareChevronRight } from 'lucide-react';
import { useEffect } from 'react';

export default function CancellationRefunds() {
  const navigate = useNavigate();

  useEffect(()=>{
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <SquareChevronRight className="h-6 w-6" />
            <span className="text-xl font-bold">Grind</span>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      <main className="container px-4 py-12 md:py-20 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Cancellation & Refund Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 6, 2025
          </p>
        </div>

        <div className="space-y-8 text-left">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>1. Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                At Grind, we strive to provide the best learning experience. This Cancellation & Refund Policy outlines the terms and conditions for cancellations and refunds of our subscription services and premium features.
              </p>
              <p>
                All payments are processed securely through Razorpay, our trusted payment gateway partner.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>2. Subscription Plans</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Grind offers the following subscription plans:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Basic Plan - ₹100</li>
                <li>Pro Plan - ₹200</li>
              </ul>
              <p>
                Each plan provides access to premium features including unlimited AI assistance, advanced problem sets, and priority support.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>3. Cancellation Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                You may cancel your subscription at any time through your account settings. Upon cancellation:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Your subscription will remain active until the end of the current billing period</li>
                <li>You will continue to have access to premium features until the subscription expires</li>
                <li>No further charges will be made to your account</li>
                <li>Auto-renewal will be disabled</li>
              </ul>
              <p>
                To cancel your subscription, please navigate to Profile → Subscription Settings → Cancel Subscription.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>4. Refund Eligibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Refunds are available under the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Requests made within 7 days of initial purchase</li>
                <li>Technical issues preventing access to premium features that we cannot resolve</li>
                <li>Duplicate or erroneous charges</li>
                <li>Unauthorized transactions (subject to verification)</li>
              </ul>
              <p>
                Refunds are <strong>not available</strong> for:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Subscription renewals (must be cancelled before renewal date)</li>
                <li>Partial refunds for unused portions of the subscription period</li>
                <li>Change of mind after 7 days of purchase</li>
                <li>Violation of Terms and Conditions resulting in account suspension</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>5. Refund Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                To request a refund:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Contact our support team through the Contact Us page or email</li>
                <li>Provide your transaction ID, registered email, and reason for refund</li>
                <li>Our team will review your request within 3-5 business days</li>
                <li>If approved, the refund will be processed through Razorpay</li>
              </ol>
              <p>
                Refund timeline:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Credit/Debit Cards: 5-7 business days</li>
                <li>Net Banking: 5-7 business days</li>
                <li>UPI: 3-5 business days</li>
                <li>Wallets: 3-5 business days</li>
              </ul>
              <p className="text-sm italic">
                Note: Refund timelines may vary depending on your bank or payment provider.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>6. Payment Failures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                In case of payment failures:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>If payment fails, your subscription will not be activated</li>
                <li>Any amount debited will be automatically refunded by Razorpay within 5-7 business days</li>
                <li>You will receive a confirmation email once the refund is processed</li>
                <li>You may retry the payment after ensuring sufficient balance/credit limit</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>7. Disputed Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you notice an unauthorized or incorrect charge:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Contact us immediately through our Contact Us page</li>
                <li>Provide transaction details and proof if available</li>
                <li>We will investigate and respond within 48 hours</li>
                <li>If confirmed as unauthorized, a full refund will be initiated immediately</li>
              </ul>
              <p>
                For chargebacks initiated through your bank, please contact us first to avoid service disruption.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>8. Promotional Offers & Discounts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Subscriptions purchased during promotional periods or with discount codes:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Are subject to the same refund policy</li>
                <li>Refunds will be processed for the amount actually paid</li>
                <li>Discount codes cannot be reused after refund</li>
                <li>Promotional offers cannot be combined with refunds for future discounts</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>9. Contact for Cancellations & Refunds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                For any questions or to request a cancellation or refund, please contact us:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Visit our Contact Us page</li>
                <li>Email us with your transaction details</li>
                <li>Include your registered email address and transaction ID</li>
              </ul>
              <p>
                We aim to respond to all cancellation and refund requests within 24-48 hours.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We reserve the right to modify this Cancellation & Refund Policy at any time. Any changes will be posted on this page with an updated "Last updated" date.
              </p>
              <p>
                Your continued use of our services after any modifications constitutes acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-border/40 bg-background/95 backdrop-blur mt-20">
        <div className="container px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <SquareChevronRight className="h-5 w-5" />
              <span className="font-semibold">Grind</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Grind. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}