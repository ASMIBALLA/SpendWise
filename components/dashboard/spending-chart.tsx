'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useExpenses } from '@/components/expense-provider'
import { CATEGORY_LABELS, CHART_COLORS, ALL_CATEGORIES } from '@/lib/constants'
import { formatCurrency } from '@/lib/format'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'

export function SpendingChart() {
  const { getSpendingByCategory, user } = useExpenses()
  const spending = getSpendingByCategory('month')

  const data = spending.map((item) => ({
    name: CATEGORY_LABELS[item.category],
    value: item.amount,
    color: CHART_COLORS[ALL_CATEGORIES.indexOf(item.category) % CHART_COLORS.length],
  }))

  const total = spending.reduce((sum, item) => sum + item.amount, 0)

  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-base">Spending by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center h-64">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <PieChartIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mt-4 text-sm font-medium">No spending data</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add expenses to see your spending breakdown
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Spending by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    const percentage = ((data.value / total) * 100).toFixed(1)
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-md">
                        <p className="text-sm font-medium">{data.name}</p>
                        <p className="text-lg font-bold">
                          {formatCurrency(data.value, user.currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {percentage}% of total
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {payload?.slice(0, 4).map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center gap-1.5">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-muted-foreground">
                          {entry.value}
                        </span>
                      </div>
                    ))}
                    {payload && payload.length > 4 && (
                      <span className="text-xs text-muted-foreground">
                        +{payload.length - 4} more
                      </span>
                    )}
                  </div>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function PieChartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  )
}
