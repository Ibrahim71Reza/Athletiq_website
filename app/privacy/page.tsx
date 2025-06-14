import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Eye, Lock, Users } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
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
              Athlytiq Privacy Policy
            </span>
          </h1>
        </div>

        <Card className="border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Your Privacy Matters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Welcome to Athlytiq, a social fitness platform designed to help you track workouts, connect with gym buddies, and engage with trainers. At Athlytiq, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our app or website (athlytiq.shalish.xyz). By using Athlytiq, you agree to the practices described in this policy.
            </p>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>1. Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-2">We collect the following types of information to provide and improve our services:</p>
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                   <li>Name, email address, and contact information</li>
                  <li>Age, weight, height, and fitness goals</li>
                  <li>Workout data and exercise preferences</li>
                  <li>Nutrition information and dietary preferences</li> 
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage Data</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Information about your interactions with Athlytiq, such as workout logs, nutrition entries, gym check-ins, posts, and challenge participation.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Location Data</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Approximate location data (e.g., for gym buddy finder or gym check-ins) if you enable location services, which can be disabled anytime.</li>
                </ul>
              </div>
             </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>2. How We Use Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">We use your information to:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Provide, maintain, and improve Athlytiq’s features, including workout tracking, community engagement, and trainer marketplace services.</li>
                <li>Personalize your experience, such as recommending workout plans or nutrition goals based on your activity.</li>
                <li>Communicate with you about updates, promotions, or support (you can opt out of marketing emails).</li>
                <li>Ensure security and prevent fraud by monitoring usage patterns.</li>
                <li>Comply with legal obligations and enforce our Terms of Service.</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>3. How We Share Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground mb-2">We do not sell your personal information. We may share it with:</p>
              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Third parties (e.g., cloud hosting, payment processors) who assist us in operating Athlytiq, under strict confidentiality agreements.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Trainers</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>If you engage with trainers, they may access your workout and nutrition data (with your consent) to provide coaching.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Community</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Posts and stories are shared publicly or with selected groups (e.g., gym buddies) based on your visibility settings.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Legal Authorities</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>If required by law or to protect our rights, safety, or property.</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Business Transfers</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>In case of a merger or acquisition, your data may be transferred to the new entity.</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>4. Data Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We implement industry-standard security measures (e.g., encryption, secure servers) to protect your data. However, no online service is 100% secure, and we cannot guarantee absolute protection. If a data breach occurs, we will notify affected users promptly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>5. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">You have control over your data:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>End-to-end encryption for sensitive data</li>
                <li>Secure cloud storage with regular backups</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication protocols</li>
                <li>Access and Update: View or edit your personal information in the app’s Profile section.</li>
                <li>Delete: Request data deletion by contacting us; we’ll remove it within 30 days unless legally required to retain it.</li>
                <li>Opt-Out: Unsubscribe from marketing emails via the link provided or adjust notification settings in the app.</li>
                <li>Location Data: Disable location services in your device settings.</li>
                <li>GDPR/CCPA Compliance: Residents of the EU or California can request data access, portability, or restriction by emailing us.</li>
                
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>6. Children’s Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Athlytiq is not intended for users under 13. We do not knowingly collect data from children. If we learn of such data, we will delete it and terminate the account.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>7. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your data may be stored and processed in countries outside your region (e.g., via cloud servers). We ensure these transfers comply with applicable data protection laws.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>8. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this Privacy Policy periodically. Changes will be posted on athlytiq.shalish.xyz with the updated date. Continued use of Athlytiq after changes constitutes acceptance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>9. Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">For questions or concerns, reach out to:</p>
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
          <p>Last Updated: June 14, 2025</p>
          <p className="mt-2">We’re here to assist you with any privacy-related matters!</p>
        </div>
      </div>
    </div>
  )
}
