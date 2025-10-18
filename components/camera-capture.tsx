"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (blob: Blob) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState("")

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsStreaming(true)
        setError("")
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.")
      console.error("Camera error:", err)
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            onCapture(blob)
            stopCamera()
          }
        }, "image/jpeg")
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      setIsStreaming(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Capture Selfie</h2>
          <button
            onClick={() => {
              stopCamera()
              onClose()
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="space-y-4">
          {!isStreaming ? (
            <Button onClick={startCamera} className="w-full bg-transparent" variant="outline">
              <Camera className="w-4 h-4 mr-2" />
              Start Camera
            </Button>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-black" />
              <div className="flex gap-2">
                <Button onClick={capturePhoto} className="flex-1 bg-purple-700 hover:bg-purple-800">
                  Capture Photo
                </Button>
                <Button
                  onClick={() => {
                    stopCamera()
                    onClose()
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}
