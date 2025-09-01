import { BackLink } from "@/components/BackLink";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PricingTable } from "@/services/clerk/components/PricingTable";
import { AlertTriangle } from "lucide-react";

export default function UpgradePage(){
  return(
    <div className="container mx-auto py-4 max-w-6xl">
      <div className="mb-4">
        <BackLink href="/app">Dashboard</BackLink>
      </div>
      <div className="space-y-16">
        <Alert variant={"warning"}>
          <AlertTriangle className="h-6 w-6 text-warning"/>
          <AlertTitle>Plan Limit Reached</AlertTitle>
          <AlertDescription className="ml-2">
            You Have reached the limit of your current plan. Please upgrade to continue using all features.
          </AlertDescription>
        </Alert>
        <PricingTable/>
      </div>
    </div>
  )
}