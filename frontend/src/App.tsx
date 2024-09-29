import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, useAnimation } from "framer-motion"

export default function App() {
  const [redVotes, setRedVotes] = useState(0)
  const [blueVotes, setBlueVotes] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [endVoting, setEndVoting] = useState(false)

  const redControls = useAnimation()
  const blueControls = useAnimation()

  const fetchResults = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch('http://192.168.67.119:8888/get_votes')
      const data = await response.json()
      
      // Animate the vote counts
      await animateVotes(data.Red, data.Blue)
      
      setRedVotes(data.Red)
      setBlueVotes(data.Blue)

      setEndVoting(true)
    } catch (error) {
      setError('Failed to fetch results. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const animateVotes = async (redFinal: number, blueFinal: number) => {
    const duration = 3000 // 3 seconds
    const steps = 60 // Update every 50ms

    for (let i = 0; i <= steps; i++) {
      const progress = i / steps
      const redCurrent = Math.round(redFinal * progress)
      const blueCurrent = Math.round(blueFinal * progress)

      await Promise.all([
        redControls.start({ count: redCurrent }),
        blueControls.start({ count: blueCurrent })
      ])

      await new Promise(resolve => setTimeout(resolve, duration / steps))
    }
  }

  const totalVotes = redVotes + blueVotes
  const redPercentage = totalVotes > 0 ? (redVotes / totalVotes) * 100 : 50
  const bluePercentage = totalVotes > 0 ? (blueVotes / totalVotes) * 100 : 50

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-5xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Election Results
        </h1>
        <div className="relative h-24 bg-gray-700 rounded-full overflow-hidden mb-12">
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-500 to-red-600"
            initial={{ width: '50%' }}
            animate={{ width: `${redPercentage}%` }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="absolute top-0 right-0 h-full bg-gradient-to-l from-blue-500 to-blue-600"
            initial={{ width: '50%' }}
            animate={{ width: `${bluePercentage}%` }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute inset-0 flex justify-between items-center px-4 text-2xl font-bold">
            <motion.span animate={redControls}>{redVotes}</motion.span>
            <motion.span animate={blueControls}>{blueVotes}</motion.span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-red-500 to-red-600 transform hover:scale-105 transition-transform duration-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Red Team</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p className="text-6xl font-bold text-white" animate={redControls}>
                {redVotes}
              </motion.p>
              <p className="text-xl text-red-200">{redPercentage.toFixed(1)}% of votes</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 transform hover:scale-105 transition-transform duration-200">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">Blue Team</CardTitle>
            </CardHeader>
            <CardContent>
              <motion.p className="text-6xl font-bold text-white" animate={blueControls}>
                {blueVotes}
              </motion.p>
              <p className="text-xl text-blue-200">{bluePercentage.toFixed(1)}% of votes</p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center">
          <Button 
            onClick={fetchResults} 
            disabled={isLoading || endVoting}
            className={`text-lg py-3 px-8 rounded-full transition-all duration-200 ${
              !isLoading && !endVoting
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white' 
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Loading...' : 'Get Results'}
          </Button>
        </div>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mt-8 text-xl text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    </div>
  )
}