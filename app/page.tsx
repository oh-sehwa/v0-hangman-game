"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skull, Ghost, Zap, Languages, Lightbulb, X } from "lucide-react"

const SPOOKY_WORDS = [
  { word: "COMPUTER", english: "An electronic device for processing data", korean: "데이터를 처리하는 전자 장치" },
  { word: "ELEPHANT", english: "A large mammal with a trunk", korean: "코가 긴 큰 포유동물" },
  { word: "RAINBOW", english: "A colorful arc in the sky", korean: "하늘의 색깔 있는 호" },
  { word: "GUITAR", english: "A stringed musical instrument", korean: "현악기" },
  { word: "MOUNTAIN", english: "A large natural elevation", korean: "큰 자연 고지" },
  { word: "BUTTERFLY", english: "A colorful flying insect", korean: "색깔 있는 나는 곤충" },
  { word: "LIBRARY", english: "A place with many books", korean: "많은 책이 있는 곳" },
  { word: "CHOCOLATE", english: "A sweet brown confection", korean: "달콤한 갈색 과자" },
  { word: "AIRPLANE", english: "A flying vehicle", korean: "나는 탈것" },
  { word: "SANDWICH", english: "Food between two pieces of bread", korean: "빵 사이에 끼운 음식" },
  { word: "TELESCOPE", english: "An instrument for viewing distant objects", korean: "먼 물체를 보는 도구" },
  { word: "BICYCLE", english: "A two-wheeled vehicle", korean: "두 바퀴 탈것" },
  { word: "VOLCANO", english: "A mountain that erupts lava", korean: "용암을 분출하는 산" },
  { word: "PENGUIN", english: "A black and white bird", korean: "흑백의 새" },
  { word: "KEYBOARD", english: "A device for typing", korean: "타이핑하는 장치" },
  { word: "DIAMOND", english: "A precious gemstone", korean: "귀중한 보석" },
  { word: "UMBRELLA", english: "Protection from rain", korean: "비를 막는 도구" },
  { word: "DOLPHIN", english: "An intelligent sea mammal", korean: "똑똑한 바다 포유동물" },
  { word: "CAMERA", english: "A device for taking pictures", korean: "사진을 찍는 장치" },
  { word: "SUNFLOWER", english: "A tall yellow flower", korean: "키 큰 노란 꽃" },
  { word: "BASKETBALL", english: "A sport played with a ball", korean: "공으로 하는 스포츠" },
  { word: "REFRIGERATOR", english: "An appliance that keeps food cold", korean: "음식을 차갑게 보관하는 기기" },
  { word: "ADVENTURE", english: "An exciting journey", korean: "흥미진진한 여행" },
  { word: "FRIENDSHIP", english: "A close relationship between people", korean: "사람들 간의 친밀한 관계" },
]

const HANGMAN_STAGES = [
  "   ┌─────┐     \n         │     \n         ○     \n        ╱│╲    \n        ╱ ╲    \n              \n ═══════════════", // 0 wrong - complete person
  "   ┌─────┐     \n         │     \n         ○     \n        ╱│╲    \n        ╱ ✗    \n              \n ═══════════════", // 1 wrong - right leg cut off
  "   ┌─────┐     \n         │     \n         ○     \n        ╱│╲    \n        ✗ ✗    \n              \n ═══════════════", // 2 wrong - left leg cut off
  "   ┌─────┐     \n         │     \n         ○     \n        ╱│✗    \n        ✗ ✗    \n              \n ═══════════════", // 3 wrong - right arm cut off
  "   ┌─────┐     \n         │     \n         ○     \n        ✗│✗    \n        ✗ ✗    \n              \n ═══════════════", // 4 wrong - left arm cut off
  "   ┌─────┐     \n         │     \n         ○     \n         ✗     \n        ✗ ✗    \n              \n ═══════════════", // 5 wrong - body cut off
  "   ┌─────┐     \n         │     \n         ✗     \n         ✗     \n        ✗ ✗    \n              \n ═══════════════", // 6 wrong - head cut off (game over)
]

export default function SpookyHangman() {
  const [currentWordObj, setCurrentWordObj] = useState<(typeof SPOOKY_WORDS)[0] | null>(null)
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">("playing")
  const [shakeAnimation, setShakeAnimation] = useState(false)
  const [showKorean, setShowKorean] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const maxHints = 2

  const initializeGame = useCallback(() => {
    const randomWordObj = SPOOKY_WORDS[Math.floor(Math.random() * SPOOKY_WORDS.length)]
    setCurrentWordObj(randomWordObj)
    setGuessedLetters(new Set())
    setWrongGuesses(0)
    setGameStatus("playing")
    setShakeAnimation(false)
    setHintsUsed(0)
  }, [])

  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  useEffect(() => {
    if (currentWordObj && gameStatus === "playing") {
      const wordLetters = new Set(currentWordObj.word.split(""))
      const guessedWordLetters = new Set([...guessedLetters].filter((letter) => wordLetters.has(letter)))

      if (wordLetters.size === guessedWordLetters.size) {
        setGameStatus("won")
        setShowPopup(true)
      } else if (wrongGuesses >= 6) {
        setGameStatus("lost")
        setShowPopup(true)
      }
    }
  }, [currentWordObj, guessedLetters, wrongGuesses, gameStatus])

  const handleGuess = (letter: string) => {
    if (guessedLetters.has(letter) || gameStatus !== "playing" || !currentWordObj) return

    const newGuessedLetters = new Set(guessedLetters)
    newGuessedLetters.add(letter)
    setGuessedLetters(newGuessedLetters)

    if (!currentWordObj.word.includes(letter)) {
      setWrongGuesses((prev) => prev + 1)
      setShakeAnimation(true)
      setTimeout(() => setShakeAnimation(false), 500)
    }
  }

  const useHint = () => {
    if (hintsUsed >= maxHints || gameStatus !== "playing" || !currentWordObj) return

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
    const wordLetters = new Set(currentWordObj.word.split(""))

    const wrongLettersNotGuessed = alphabet.filter((letter) => !guessedLetters.has(letter) && !wordLetters.has(letter))

    if (wrongLettersNotGuessed.length > 0) {
      const lettersToMark = Math.min(wrongLettersNotGuessed.length, Math.floor(Math.random() * 3) + 3)
      const selectedLetters = wrongLettersNotGuessed.sort(() => Math.random() - 0.5).slice(0, lettersToMark)

      const newGuessedLetters = new Set(guessedLetters)
      selectedLetters.forEach((letter) => newGuessedLetters.add(letter))

      setGuessedLetters(newGuessedLetters)
      setHintsUsed((prev) => prev + 1)
    }
  }

  const displayWord = currentWordObj
    ? currentWordObj.word
        .split("")
        .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
        .join(" ")
    : ""

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

  const getGameStatusMessage = () => {
    switch (gameStatus) {
      case "won":
        return { message: "🎃 You saved them from dismemberment! 👻", color: "text-secondary" }
      case "lost":
        return {
          message: `💀 They've been completely dismembered! The word was: ${currentWordObj?.word} 🕷️`,
          color: "text-primary",
          showDefinition: true,
        }
      default:
        return { message: "🕸️ Save them from being dismembered... ⚰️", color: "text-muted-foreground" }
    }
  }

  const statusMessage = getGameStatusMessage()

  const closePopup = () => {
    setShowPopup(false)
  }

  const startNewGame = () => {
    setShowPopup(false)
    initializeGame()
  }

  if (!currentWordObj) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card p-2 sm:p-4">
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-card border-primary/20 relative">
            <Button variant="ghost" size="sm" onClick={closePopup} className="absolute right-2 top-2 z-10">
              <X className="w-4 h-4" />
            </Button>

            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl font-bold text-primary">
                {gameStatus === "won" ? "🎉 Victory! 🎉" : "💀 Game Over 💀"}
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              {/* Character Image */}
              <div className="flex justify-center">
                <img
                  src={gameStatus === "won" ? "/game-won.jpg" : "/game-lost.jpg"}
                  alt="Character"
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg border-2 border-primary/20 object-contain"
                />
              </div>

              {/* Character Message */}
              <div className="space-y-3">
                {gameStatus === "won" ? (
                  <div>
                    <p className="text-lg font-semibold text-secondary mb-2">"살려줘서 정말 고마워!"</p>
                    <p className="text-sm text-muted-foreground">
                      The word was: <span className="font-bold text-foreground">{currentWordObj?.word}</span>
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-semibold text-primary mb-2">"아쉽게도 실패했어... 정답은 이거였어!"</p>
                    <p className="text-sm text-muted-foreground">
                      The word was: <span className="font-bold text-foreground">{currentWordObj?.word}</span>
                    </p>
                  </div>
                )}

                {/* Definition */}
                <div className="p-3 bg-card/70 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowKorean(!showKorean)}
                      className="text-xs px-2"
                    >
                      <Languages className="w-3 h-3 mr-1" />
                      {showKorean ? "한글" : "ENG"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {showKorean ? currentWordObj?.korean : currentWordObj?.english}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Button onClick={startNewGame} className="flex-1" size="lg">
                  🦇 New Game 🕸️
                </Button>
                <Button onClick={closePopup} variant="outline" className="flex-1 bg-transparent" size="lg">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-2 sm:mb-4 glow text-primary">🎃 HANGMAN 💀</h1>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground flicker">
            Test your vocabulary by guessing the word!
          </p>
        </div>

        {/* Gallows and Game Info */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-8">
          {/* Gallows and Game Info */}
          <Card className="bg-card/50 border-primary/20 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center justify-center gap-2 text-primary text-sm sm:text-base">
                <Skull className="w-4 h-4 sm:w-6 sm:h-6" />
                The Gallows
                <Skull className="w-4 h-4 sm:w-6 sm:h-6" />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div
                className={`font-mono text-xs sm:text-sm md:text-lg whitespace-pre-line text-center mb-4 sm:mb-6 text-primary leading-tight ${shakeAnimation ? "shake" : ""}`}
                style={{
                  fontFamily: 'Monaco, "Lucida Console", monospace',
                  letterSpacing: "0.05em",
                }}
              >
                {HANGMAN_STAGES[wrongGuesses]}
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="destructive" className="text-xs sm:text-sm">
                    <Ghost className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Wrong: {wrongGuesses}/6
                  </Badge>
                  <Badge variant="secondary" className="text-xs sm:text-sm">
                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Remaining: {6 - wrongGuesses}
                  </Badge>
                </div>

                <div className="flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={useHint}
                      disabled={hintsUsed >= maxHints || gameStatus !== "playing"}
                      className="text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <Lightbulb className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Hint ({maxHints - hintsUsed} left)
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <p className={`text-sm sm:text-lg mb-2 ${statusMessage.color}`}>{statusMessage.message}</p>
                  {statusMessage.showDefinition && (
                    <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-card/70 rounded-lg border border-primary/20">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowKorean(!showKorean)}
                          className="text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <Languages className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          {showKorean ? "한글" : "ENG"}
                        </Button>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {showKorean ? currentWordObj.korean : currentWordObj.english}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Word and Alphabet */}
          <Card className="bg-card/50 border-secondary/20 backdrop-blur-sm">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-center text-secondary text-sm sm:text-base">🕯️ The Word 🔮</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Word Display */}
              <div className="text-center mb-4 sm:mb-8">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-wider text-foreground mb-2 sm:mb-4 glow break-all">
                  {displayWord}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">{currentWordObj.word.length} letters</p>
              </div>

              {/* Alphabet Grid */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-1 sm:gap-2 mb-4 sm:mb-6">
                {alphabet.map((letter) => {
                  const isGuessed = guessedLetters.has(letter)
                  const isCorrect = isGuessed && currentWordObj.word.includes(letter)
                  const isWrong = isGuessed && !currentWordObj.word.includes(letter)

                  return (
                    <Button
                      key={letter}
                      variant={isCorrect ? "secondary" : isWrong ? "destructive" : "outline"}
                      size="sm"
                      className={`h-10 sm:h-12 text-sm sm:text-lg font-bold transition-all duration-200 ${
                        isGuessed ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:glow active:scale-95"
                      }`}
                      onClick={() => handleGuess(letter)}
                      disabled={isGuessed || gameStatus !== "playing"}
                    >
                      {letter}
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guessed Letters Display */}
        {guessedLetters.size > 0 && (
          <Card className="mt-4 sm:mt-8 bg-card/30 border-muted/20">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">Letters guessed:</p>
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {Array.from(guessedLetters).map((letter) => (
                    <Badge
                      key={letter}
                      variant={currentWordObj.word.includes(letter) ? "secondary" : "destructive"}
                      className="text-xs sm:text-sm"
                    >
                      {letter}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
