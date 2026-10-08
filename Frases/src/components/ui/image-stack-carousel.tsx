"use client";

import { motion, type PanInfo, useMotionValue, useTransform } from "framer-motion";
import React, { useState } from "react";
import phrases from "@/data/frases.json";

const cardColors = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
];

export interface PhraseCard {
  id: number;
  text: string;
  color: string;
}

interface PhraseCardProps {
  card: PhraseCard;
  isFront: boolean;
  zIndex: number;
  stackIndex: number;
  onSendToBack: () => void;
}

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
  }
  return result;
}

function createDeck(): PhraseCard[] {
  let previousColor = "";
  const deck = shuffle(phrases).map((phrase) => {
    const availableColors = cardColors.filter((color) => color !== previousColor);
    const color = availableColors[Math.floor(Math.random() * availableColors.length)];
    previousColor = color;
    return { id: phrase.id, text: phrase.text, color };
  });

  if (deck.length > 1 && deck[deck.length - 1].color === deck[0].color) {
    const finalColorOptions = cardColors.filter(
      (color) => color !== deck[0].color && color !== deck[deck.length - 2].color,
    );
    deck[deck.length - 1].color =
      finalColorOptions[Math.floor(Math.random() * finalColorOptions.length)];
  }

  return deck;
}

function PhraseCardView({
  card,
  isFront,
  zIndex,
  stackIndex,
  onSendToBack,
}: PhraseCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [12, -12]);
  const rotateY = useTransform(x, [-200, 200], [-12, 12]);

  function handleDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    if (Math.abs(info.offset.x) > 100 || Math.abs(info.offset.y) > 100) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  return (
    <motion.div
      className="absolute h-[min(70vh,calc(100dvh-190px))] w-[70vw] touch-none cursor-grab select-none active:cursor-grabbing sm:h-[clamp(290px,72vw,380px)] sm:w-[clamp(220px,56vw,300px)]"
      style={{
        x: isFront ? x : 0,
        y: isFront ? y : 0,
        rotateX: isFront ? rotateX : 0,
        rotateY: isFront ? rotateY : 0,
        zIndex,
      }}
      drag={isFront}
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.5}
      onDragEnd={handleDragEnd}
      whileHover={isFront ? { scale: 1.03 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.article
        className="flex h-full w-full flex-col justify-between overflow-hidden p-6 text-left text-white shadow-2xl sm:p-8"
        style={{ backgroundColor: card.color, borderRadius: 24 }}
        animate={{
          rotateZ: stackIndex * 1.5,
          scale: 1 - stackIndex * 0.035,
          transformOrigin: "85% 85%",
        }}
        initial={false}
      >
        <span className="text-5xl font-black tracking-tight opacity-80">
          {card.id.toString().padStart(2, "0")}
        </span>
        <p className="pb-1 text-xl font-semibold leading-snug sm:text-2xl">{card.text}</p>
        <span className="text-xs font-bold uppercase tracking-[0.25em] opacity-75">
          desliza para continuar
        </span>
      </motion.article>
    </motion.div>
  );
}

interface SwipeCardsProps {
  className?: string;
}

export function SwipeCards({ className = "" }: SwipeCardsProps) {
  const [cardList, setCardList] = useState<PhraseCard[]>(createDeck);

  function moveToBack(id: number) {
    setCardList((currentCards) => {
      const cardIndex = currentCards.findIndex((card) => card.id === id);
      if (cardIndex === -1) return currentCards;
      return [
        ...currentCards.slice(cardIndex + 1),
        ...currentCards.slice(0, cardIndex + 1),
      ];
    });
  }

  return (
    <div className={`flex min-h-0 select-none items-start justify-center p-0 ${className}`}>
      <div className="relative h-[min(70vh,calc(100dvh-190px))] w-[70vw] [perspective:1200px] sm:h-[clamp(290px,72vw,380px)] sm:w-[clamp(220px,56vw,300px)]">
        {cardList.slice(0, 6).map((card, index) => (
          <PhraseCardView
            key={card.id}
            card={card}
            isFront={index === 0}
            zIndex={cardList.length - index}
            stackIndex={index}
            onSendToBack={() => moveToBack(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default SwipeCards;
