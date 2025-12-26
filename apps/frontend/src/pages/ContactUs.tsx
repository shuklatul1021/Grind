// ContactUs.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/card';
import { Input } from '@repo/ui/input';
import { Textarea } from '@repo/ui/textarea';
import { ArrowLeft, Mail, MessageSquare, Phone, SquareChevronRight, Send, MapPin } from 'lucide-react';
import { toast } from '../../../../packages/ui/src/hooks/use-toast';

export default function ContactUs() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24-48 hours.",
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

      <main className="container px-4 py-12 md:py-20 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Get in Touch
          </h1>
          <p className="text-muted-foreground text-lg">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="border-border/40 bg-card/50 backdrop-blur text-center">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Email Us</h3>
              <p className="text-sm text-muted-foreground mb-2">
                For general inquiries and support
              </p>
              <p className="text-sm text-blue-500">
                support@grind.com
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur text-center">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Mon-Fri from 9am to 6pm IST
              </p>
              <p className="text-sm text-green-500">
                +91 XXX XXX XXXX
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur text-center">
            <CardContent className="pt-6">
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold mb-2">Visit Us</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Come say hello at our office
              </p>
              <p className="text-sm text-purple-500">
                India
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium mb-2 block">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium mb-2 block">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="text-sm font-medium mb-2 block">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium mb-2 block">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border/40 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-left">
              <div>
                <h3 className="font-semibold mb-2">How quickly will I receive a response?</h3>
                <p className="text-sm text-muted-foreground">
                  We typically respond to all inquiries within 24-48 hours during business days. For urgent matters, please mention "Urgent" in the subject line.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What should I include in my message?</h3>
                <p className="text-sm text-muted-foreground">
                  Please provide as much detail as possible about your inquiry, including your account email (if applicable), transaction ID for payment issues, and any error messages you've encountered.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can I request a refund through this form?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Please include your transaction ID and reason for the refund request. Refer to our Cancellation & Refund Policy for eligibility criteria.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Do you offer technical support?</h3>
                <p className="text-sm text-muted-foreground">
                  Absolutely! Our team is here to help with any technical issues, login problems, or feature questions. Premium subscribers receive priority support.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How can I report a bug or issue?</h3>
                <p className="text-sm text-muted-foreground">
                  Use this contact form and select "Technical Issue" as your subject. Include details about what happened, when it occurred, and any screenshots if possible.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/40 bg-card/50 backdrop-blur mt-8">
          <CardHeader>
            <CardTitle>Business Inquiries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-left text-muted-foreground">
            <p>
              For partnership opportunities, institutional licensing, bulk subscriptions for organizations, or media inquiries, please reach out to our business development team:
            </p>
            <p className="text-blue-500 font-medium">
              business@grind.com
            </p>
            <p className="text-sm">
              We're always interested in collaborating with educational institutions, coding bootcamps, and corporate training programs.
            </p>
          </CardContent>
        </Card>
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