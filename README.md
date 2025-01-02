# Rose Garden Game (Two Stage Task)

A React.JS game developed for the Center for Computational Psychiatry at Mount Sinai. 

The game is a variation of the two-stage behavioral task paradigm without explicit external rewards, developed for both local and online deployment.

[Link to play game](https://rose-garden-two-step.vercel.app/)

Author: Ember Zhang

Date: August 2024

## Overview

Based on the "two-stage" task paradigm in cognitive behavioral research, players make sequential choices to grow roses in a garden. The game measures task perseverance through players' color preferences over time.

## Gameplay

Players make two consecutive choices each round:

1. Select a gardening store
2. Choose a gardener

These choices result in planting either a red or yellow rose in the garden.

The game features probabilistic mapping between choices and outcomes:

- Stage 1: Store selection influences available gardeners (80%/20% probability split)
- Stage 2: Gardener selection affects rose color (80%/20% probability for red/yellow roses)

Players interact with:
- 2 gardening stores
- 2 pairs of gardeners

## Research Purpose

The game tracks players' preferences for rose colors and pattern choices, providing data on behavioral compulsions and task perseverance.
