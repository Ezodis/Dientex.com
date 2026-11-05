import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { LucideIcon } from "lucide-react"
import { motion } from "framer-motion"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

export function StatsCard({ title, value, icon: Icon, trend, description }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <p className={`text-xs ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
              {trend.isPositive ? "+" : "-"}
              {Math.abs(trend.value)}% desde el mes pasado
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
