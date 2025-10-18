import { Construction, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Maintenance() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <header className="bg-white px-4 py-4 border-b border-gray-200 lg:hidden">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 pb-24 lg:pb-12">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center">
              <Construction className="w-12 h-12 text-white" />
            </div>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">We are Upgrading!</h1>

          <p className="text-gray-600 mb-6 leading-relaxed">
            We are working hard to bring you a better experience. This feature will be available soon. Thank you for your
            patience!
          </p>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-orange-200 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold text-orange-600">Coming Soon:</span>
            </p>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Enhanced user interface</li>
              <li>• Faster performance</li>
              <li>• New features and improvements</li>
            </ul>
          </div>

          <Link href="/">
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Return to Home</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
