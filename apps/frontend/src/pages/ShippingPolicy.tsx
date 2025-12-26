import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { ArrowLeft, Package, SquareChevronRight } from 'lucide-react';
import { useEffect } from 'react';

export default function ShippingPolicy() {
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
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Shipping & Delivery Policy
          </h1>
          <p className="text-muted-foreground">
            Last updated: December 6, 2025
          </p>
        </div>

        <div className="space-y-8 text-left">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Nature of Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Grind is a <strong>digital platform</strong> that provides online coding education, practice problems, AI-powered assistance, and competitive programming tools. All our services are delivered digitally through our web-based platform.
              </p>
              <p>
                <strong>No physical products or materials are shipped.</strong>
              </p>
              <p>
                This Shipping & Delivery Policy outlines how our digital services are delivered to users.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Digital Service Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Upon successful payment and account verification:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Instant Access:</strong> Premium features are activated immediately</li>
                <li><strong>No Waiting Period:</strong> Services are available 24/7 from any device</li>
                <li><strong>Immediate Activation:</strong> Subscription benefits apply instantly</li>
                <li><strong>Cloud-Based:</strong> All content is accessible through your web browser</li>
              </ul>
              <p>
                You will receive a confirmation email upon successful activation of your subscription.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Service Activation Process</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                When you purchase a subscription plan:
              </p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>Complete the payment through Razorpay secure payment gateway</li>
                <li>Receive instant payment confirmation</li>
                <li>Your account is automatically upgraded to premium status</li>
                <li>Access all premium features immediately</li>
                <li>Receive a confirmation email with subscription details</li>
              </ol>
              <p className="mt-4">
                <strong>Activation Time:</strong> Instant (within seconds of successful payment)
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Access to Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Once your subscription is active, you can access Grind services through:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Web Browser:</strong> Access from any modern web browser (Chrome, Firefox, Safari, Edge)</li>
                <li><strong>Multiple Devices:</strong> Use the same account on desktop, laptop, or tablet</li>
                <li><strong>Any Location:</strong> Access from anywhere with an internet connection</li>
                <li><strong>24/7 Availability:</strong> Services available round the clock</li>
              </ul>
              <p>
                System Requirements:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Stable internet connection (minimum 2 Mbps recommended)</li>
                <li>Modern web browser with JavaScript enabled</li>
                <li>Screen resolution of 1280x720 or higher for optimal experience</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Delivery Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                If you experience any issues accessing your subscription after payment:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Payment Successful but No Access:</strong> Wait 5 minutes and refresh your browser. If issue persists, contact support immediately.</li>
                <li><strong>Login Issues:</strong> Verify you're using the correct email address used during registration.</li>
                <li><strong>Features Not Available:</strong> Clear browser cache and cookies, then log in again.</li>
                <li><strong>Technical Errors:</strong> Contact our support team through the Contact Us page.</li>
              </ul>
              <p className="mt-4">
                Our support team is available to resolve any access issues within 24 hours of contact.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Service Continuity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We are committed to providing uninterrupted service:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>99.9% Uptime:</strong> Our platform is designed for maximum availability</li>
                <li><strong>Regular Backups:</strong> Your data and progress are backed up continuously</li>
                <li><strong>Scheduled Maintenance:</strong> Any planned downtime is announced in advance</li>
                <li><strong>Quick Recovery:</strong> Technical issues are resolved promptly</li>
              </ul>
              <p>
                In case of service interruption, subscription time is extended automatically to compensate for the downtime.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>International Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Grind services are available globally:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No geographical restrictions on service access</li>
                <li>Platform accessible from any country with internet connectivity</li>
                <li>Same features available to all users regardless of location</li>
                <li>Payment processing available in multiple currencies through Razorpay</li>
              </ul>
              <p>
                Note: Internet speed and accessibility may vary based on your location and service provider.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>No Physical Shipments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Important Notice:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Grind does not ship any physical products</li>
                <li>No certificates or materials are mailed</li>
                <li>All documentation is available digitally through your account</li>
                <li>Completion certificates (if applicable) are provided as digital downloads</li>
              </ul>
              <p>
                There are no shipping charges, delivery fees, or customs duties as all services are delivered digitally.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Customer Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                For assistance with service delivery or access issues:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Visit our Contact Us page for immediate support</li>
                <li>Email us with your account details and issue description</li>
                <li>Check our Help Center for common troubleshooting steps</li>
              </ul>
              <p>
                We strive to resolve all delivery-related issues within 24 hours.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                We may update this Shipping & Delivery Policy periodically. Any changes will be posted on this page with an updated "Last updated" date.
              </p>
              <p>
                As we continue to expand our services, this policy may be updated to reflect new delivery methods or service features.
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