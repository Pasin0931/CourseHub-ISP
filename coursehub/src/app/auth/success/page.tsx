"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader } from "lucide-react"

function AuthSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")

    if (token) {
      localStorage.setItem("access_token", token)
      router.replace("/courses")
    } else {
      router.replace("/?error=missing_token")
    }
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader className="animate-spin" />
    </div>
  )
}

export default function AuthSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader className="animate-spin" />
        </div>
      }
    >
      <AuthSuccessContent />
    </Suspense>
  )
}