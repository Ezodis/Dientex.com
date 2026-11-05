"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"

const teeth = [
  // Upper teeth
  [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28],
  // Lower teeth
  [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38],
]

interface ToothStatus {
  [key: number]: "healthy" | "cavity" | "filled" | "missing" | "treatment"
}

export function Odontogram() {
  const [toothStatus, setToothStatus] = useState<ToothStatus>({})

  const getToothColor = (toothNumber: number) => {
    const status = toothStatus[toothNumber] || "healthy"
    const colors = {
      healthy: "bg-white border-gray-300",
      cavity: "bg-red-100 border-red-400",
      filled: "bg-blue-100 border-blue-400",
      missing: "bg-gray-300 border-gray-400",
      treatment: "bg-yellow-100 border-yellow-400",
    }
    return colors[status]
  }

  const handleToothClick = (toothNumber: number) => {
    const statuses: Array<"healthy" | "cavity" | "filled" | "missing" | "treatment"> = [
      "healthy",
      "cavity",
      "filled",
      "missing",
      "treatment",
    ]
    const currentStatus = toothStatus[toothNumber] || "healthy"
    const currentIndex = statuses.indexOf(currentStatus)
    const nextStatus = statuses[(currentIndex + 1) % statuses.length]

    setToothStatus((prev) => ({
      ...prev,
      [toothNumber]: nextStatus,
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Odontograma</CardTitle>
        <div className="flex gap-4 text-xs flex-wrap">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-white border-2 border-gray-300" />
            <span>Sano</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-400" />
            <span>Caries</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-400" />
            <span>Obturado</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-gray-300 border-2 border-gray-400" />
            <span>Ausente</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 rounded bg-yellow-100 border-2 border-yellow-400" />
            <span>En tratamiento</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Upper teeth */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center">Arcada Superior</p>
          <div className="flex justify-center gap-1">
            {teeth[0].map((toothNumber) => (
              <button
                key={toothNumber}
                onClick={() => handleToothClick(toothNumber)}
                className={`w-8 h-12 rounded border-2 hover:shadow-md transition-all flex items-center justify-center text-xs font-medium ${getToothColor(
                  toothNumber
                )}`}
              >
                {toothNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Lower teeth */}
        <div className="space-y-2">
          <div className="flex justify-center gap-1">
            {teeth[1].map((toothNumber) => (
              <button
                key={toothNumber}
                onClick={() => handleToothClick(toothNumber)}
                className={`w-8 h-12 rounded border-2 hover:shadow-md transition-all flex items-center justify-center text-xs font-medium ${getToothColor(
                  toothNumber
                )}`}
              >
                {toothNumber}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground text-center">Arcada Inferior</p>
        </div>
      </CardContent>
    </Card>
  )
}
