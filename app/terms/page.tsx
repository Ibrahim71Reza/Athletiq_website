import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, AlertTriangle, Scale, Users } from "lucide-react"
import Link from "next/link"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Athlytiq Terms of Service
            </span>
          </h1>
        </div>

        <div className="space-y-8">
          <Card className="border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Last Updated: June 14, 2025</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Welcome to Athlytiq, a social fitness platform where you can track workouts, connect with gym buddies, and engage with trainers. These Terms of Service (“Terms”) govern your use of the Athlytiq app and website (athlytiq.shalish.xyz). By accessing or using Athlytiq, you agree to be bound by these Terms. If you do not agree, please do not use our services.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>1. Acceptance of Terms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By using Athlytiq, you confirm you are at least 13 years old and agree to these Terms, our Privacy Policy, and any additional guidelines we provide. We may update these Terms, and continued use after changes means acceptance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>2. Account Registration</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>You must create an account with a valid email and password.</li>
                <li>Provide accurate information and update it as needed.</li>
                <li>You are responsible for maintaining account security. Notify us at athlytiq@gmail.com if you suspect unauthorized use.</li>
                <li>We may suspend or terminate accounts for violation of these Terms.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>3. Use of Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Permitted Use</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Use Athlytiq to track workouts,</li>
                  <li>connect with others,</li>
                  <li>access trainer services as intended.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Prohibited Actions</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Do not use Athlytiq for illegal activities, harass others, post harmful content, or attempt to bypass security measures.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Community Guidelines</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Respect others in posts, stories, and groups. Offensive behavior may result in account suspension.</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Do not share inappropriate or harmful content</li>
                  <li>Do not attempt to hack or disrupt the service</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>4. Trainer Marketplace</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Important Health Notice</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Athlytiq provides fitness and nutrition information for educational purposes only. Always consult
                  with healthcare professionals before starting any exercise or diet program.
                </p>
              </div>

              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Trainers offer plans and coaching services. Payments are processed through our secure system, and fees are non-refundable unless otherwise stated.</li>
                <li>Users engage trainers at their own risk. Athlytiq is not liable for trainer-provided advice.</li>
                <li>Trainers must comply with applicable laws and provide accurate services.</li>
                <li>We are not responsible for any injuries or health issues</li>
                <li>Exercise at your own risk and within your capabilities</li>
                <li>Stop exercising if you experience pain or discomfort</li>
                <li>Our AI recommendations are not medical advice</li>
                <li>Individual results may vary</li>
              </ul>
            </CardContent>
          </Card>
<Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>5. Service Availability</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>Scheduled maintenance may temporarily affect availability</li>
                <li>We reserve the right to modify or discontinue features</li>
                <li>Emergency maintenance may occur without prior notice</li>
                <li>We are not liable for any losses due to service interruptions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>6. Intellectual Property</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Athlytiq Content</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Athlytiq and its content (e.g., design, logos) are owned by us or our licensors. You may not reproduce or distribute them without permission.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">User-generated Content</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>User-generated content (e.g., posts) remains yours, but you grant us a license to display it on Athlytiq.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>7. Payments and Subscriptions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Some features (e.g., premium plans) require payment. Prices are listed in the app, and transactions are final unless a refund is offered.</li>
                <li>We use third-party payment processors (e.g., Stripe) with their own terms.</li>
                <li>Subscriptions auto-renew unless canceled before the renewal date.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>8. Disclaimer of Warranties</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Important Notice</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Athlytiq is provided “as is.” We do not guarantee uninterrupted service or that it will meet all your expectations. Fitness advice is for general use; consult a professional for medical guidance.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scale className="h-5 w-5" />
                <span>9. Limitation of Liability</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We are not liable for indirect damages (e.g., lost profits) arising from your use of Athlytiq. Our total liability will not exceed the amount you paid us in the past 12 months.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>10. Termination</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may terminate or suspend your access to Athlytiq at our discretion, with or without notice, if you violate these Terms. You may delete your account anytime via the app.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>11. Governing Law</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                These Terms are governed by the laws of Bangladesh. Disputes will be resolved in Dhaka courts.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>12. Changes to Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may modify or discontinue Athlytiq features at any time. We will notify you of significant changes via the app or email.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>13. Contact Us</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">For questions or concerns, contact:</p>
              <div className="space-y-2 text-muted-foreground">
                <p>Email: athlytiq@gmail.com</p>
                <p>Phone: +8801776225423</p>
                <p>Address: House 33, Road 2, Kawlar, Dakshinkhan, Dhaka, Bangladesh</p>
                <p>Website: athlytiq.shalish.xyz</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Last updated: June 14, 2025</p>
          <p className="mt-2">Thank you for choosing Athlytiq—let’s build a healthier community together!</p>
        </div>
      </div>
    </div>
  )
}
