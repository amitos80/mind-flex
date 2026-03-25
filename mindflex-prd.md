# Product Requirements Document (PRD): MindFlex Extension

## Project Overview
MindFlex is a Chrome extension designed for cognitive training. It scans web pages for complex words, masks portions of them, and challenges the user to complete the word based on context. The primary goal is to provide a seamless, non-intrusive brain exercise during regular web browsing.


## Core Functional Features

### A. NLP Word Analysis & Masking
- ***Word Identification***: Scan the DOM to identify complex words based on length (e.g., >8 characters) or a frequency-based dictionary.
- ***Masking Algorithm***: Dynamically hide parts of the word (suffixes or roots).
    - ***Example***: "Aggressive" $\rightarrow$ "Aggress___".
- Difficulty Levels:
    - ***Easy***: Mask the last 2 letters.
    - ***Medium***: Mask 50% of the word.
    - ***Hard***: Mask everything except the first letter.

### B. "The Ghost Input" UX
Instead of standard, clunky input fields, we will use an Inline Placeholder approach:
- The missing part of the word appears as a dynamic dotted underline within the sentence.
- Upon interaction (click or hover), a small, accessible popover appears for selection.


## High-End UX & Wireframes

### Interaction Logic (Wireframe):
1. ***Reading State***: The text looks natural, but masked words are highlighted in a soft pastel color (e.g., light blue) with a dotted underline.
    - Visual: "The decision was highly aggress____ in nature."
2. ***The Choice Matrix (Popover)***:
    - Clicking the word triggers a "Bubble" popover above the text.
    - The bubble contains 3 large buttons with options (the correct completion + 2 distractors).
    - Accessibility: Large text, high contrast, and generous padding for easy clicking.

### UI Reference Sketch:

    [Text] ...The decision was aggress[ ? ] in nature...
    [On Click Popover]
    +-----------+  +-----------+  +-----------+
    |   -ive    |  |   -ion    |  |   -ly     |
    +-----------+  +-----------+  +-----------+
    (One-click selection for seamless flow)


## Technical Implementation Details (for LLM)

### Module Breakdown:
- ***Content Script Manager***: Responsible for DOM traversal and injecting CSS/JS without breaking the host site's layout.
- ***Word Processor Logic***: * Regex-based word detection.
    - Distractor Generator: A function that creates 2 similar-looking suffixes or word endings to challenge the user.
- ***Interaction Component***:
    - Built using Web Components (Custom Elements) to utilize Shadow DOM. This prevents the website's CSS from "leaking" into our game UI.
- ***Gamification Engine:***
    - Score tracking for correct completions.
    - Minimal feedback loops (e.g., a subtle haptic-like color shift to green on success).