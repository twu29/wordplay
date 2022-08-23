export const examples: Record<string, string> = {
WhatWord:
`
↓ ⌨️

•GameState(playing•? guesses•[""] secret•""∨!)
(
    ƒ guessesRemaining() secret.length · 2 - guesses.length
    ƒ won() secret→[].every(ƒ(letter) guesses.has(letter))
    ƒ lost() guessesRemaining() < 0
)

words: ['kitty' 'house' 'heat' 'fart' 'townhouse' 'heatwave']

state: GameState(⊥ [] !) 
    ∆ ⌨️ 
        ⌨️.key = "Space"  ? GameState(⊤ [] words.random())
        ⌨️.key = "Escape" ? GameState(⊥ [] !)
        GameState(⊤ state.guesses.add(⌨️.key) state.secret)

ƒ title(messages•[""]) Group(Vertical() messages.translate(ƒ(m) Sentence(m)))

Verse(
    state.playing ? 
        (   
            state.lost() ? title(["You lost. Press space to play again."])
            state.won() ? title(["You won, nice job! Press space to play again."])
            Group(
                Vertical()
                Sentence(size: 24pt text: state.secret→[].translate(ƒ(letter) state.guesses.has(letter) ? letter "_").join(' '))
                Sentence(size: 16pt "Guesses: /state.guesses.join(' ')/")
                Sentence(size: 12pt "/state.guessesRemaining()/ remaining")
            )
        )
        title(["Welcome to WhatWord!" "Press space to begin..."])
    font: "Noto Sans"
    size: 12pt
)
`,
AnimatedFace: 
`
↓⏱
🥹: {⊤: «😀» ⊥: «😂»}
∥: ⏱ % 2 = 0ms
Sentence(🥹{∥} 32pt «Noto Sans»)
`
};