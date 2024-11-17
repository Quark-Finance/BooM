'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/customProgressBar';
import RaffleSection from '@/components/RaffleSection';

interface Quest {
  id: number;
  name: string;
  description: string;
  progress: number; // Percentage (0-100)
  status: 'completed' | 'ongoing' | 'claimed';
  reward: number; // BOOM points
  canClaim?: boolean;
}

// Initial quests
const initialQuests: Quest[] = [
  { id: 1, name: 'Trade 5 Tokens', description: 'Complete 5 trades on the marketplace.', progress: 100, status: 'completed', reward: 100, canClaim: true },
  { id: 2, name: 'Invite a Friend', description: 'Invite a friend to join BooMarket.', progress: 33, status: 'ongoing', reward: 50 },
  { id: 3, name: 'Daily Login', description: 'Log in every day for a week.', progress: 100, status: 'completed', reward: 75, canClaim: true },
  { id: 4, name: 'First Trade', description: 'Complete your first trade on BooMarket.', progress: 100, status: 'claimed', reward: 25 },
];

export default function RewardsPage() {
  const [quests, setQuests] = useState<Quest[]>(() => {
    const savedQuests = localStorage.getItem('quests');
    if (savedQuests) {
      try {
        return JSON.parse(savedQuests);
      } catch (error) {
        console.error('Error parsing quests from localStorage:', error);
        return initialQuests;
      }
    } else {
      return initialQuests;
    }
  });

  const [totalBoom, setTotalBoom] = useState<number>(() => {
    const savedPoints = localStorage.getItem('totalBoom');
    return savedPoints ? parseInt(savedPoints, 10) : 0;
  });

  // Save quests and points to localStorage
  useEffect(() => {
    localStorage.setItem('quests', JSON.stringify(quests));
    localStorage.setItem('totalBoom', totalBoom.toString());
  }, [quests, totalBoom]);

  // Claim BOOM points for a completed quest with fireworks
  const handleClaim = (id: number) => {
    let claimedQuestReward = 0;

    setQuests((prevQuests) => {
      const updatedQuests = prevQuests.map((quest) => {
        if (quest.id === id) {
          claimedQuestReward = quest.reward;
          return { ...quest, status: 'claimed' as 'claimed', canClaim: false };
        }
        return quest;
      });

      // Trigger confetti animation
      triggerConfetti();

      // Update totalBoom after the reward is claimed
      setTotalBoom((prevPoints) => prevPoints + claimedQuestReward);
      return updatedQuests;
    });
  };

  // Trigger confetti animation
  const triggerConfetti = () => {
    const duration = 500;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 30, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // Separate quests into categories
  const ongoingQuests = quests.filter((quest) => quest.status === 'ongoing');
  const claimableQuests = quests.filter(
    (quest) => quest.status === 'completed' && quest.canClaim
  );
  const claimedQuests = quests.filter((quest) => quest.status === 'claimed');

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎯 Rewards</h1>
      <p className="text-lg text-gray-500 mb-4">
        Your 👻 BOOM Points: <span className="font-semibold text-primary">{totalBoom}</span>
      </p>

      {/* Tabs for Quests */}
      <Tabs defaultValue="ongoing" className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="claimed">Claimed</TabsTrigger>
        </TabsList>

        {/* Ongoing Quests */}
        <TabsContent value="ongoing">
          {ongoingQuests.length === 0 ? (
            <p className="text-gray-500">No ongoing quests at the moment.</p>
          ) : (
            ongoingQuests.map((quest) => (
              <div
                key={quest.id}
                className="mb-4 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-background"
              >
                <h2 className="text-lg font-bold">{quest.name}</h2>
                <p className="text-gray-500 mb-2">{quest.description}</p>
                <Progress value={quest.progress} className="mb-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Progress: {quest.progress}%</span>
                  <span className="text-sm font-bold text-secondary">Reward: {quest.reward} BOOM</span>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Completed Quests */}
        <TabsContent value="completed">
          {claimableQuests.length === 0 ? (
            <p className="text-gray-500">No completed quests to claim.</p>
          ) : (
            claimableQuests.map((quest) => (
              <div
                key={quest.id}
                className="mb-4 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-background"
              >
                <h2 className="text-lg font-bold">{quest.name}</h2>
                <p className="text-gray-500 mb-2">{quest.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Reward: {quest.reward} BOOM</span>
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg font-semibold"
                    onClick={() => handleClaim(quest.id)}
                  >
                    Claim
                  </button>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Claimed Quests */}
        <TabsContent value="claimed">
          {claimedQuests.length === 0 ? (
            <p className="text-gray-500">No claimed quests yet.</p>
          ) : (
            claimedQuests.map((quest) => (
              <div
                key={quest.id}
                className="mb-4 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 bg-background"
              >
                <h2 className="text-lg font-bold text-gray-400">{quest.name}</h2>
                <p className="text-gray-500 mb-2">{quest.description}</p>
                <span className="text-sm font-bold text-gray-400">Reward: {quest.reward} BOOM</span>
              </div>
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Raffle Section */}
      <RaffleSection totalBoom={totalBoom} setTotalBoom={setTotalBoom} />
    </div>
  );
}
