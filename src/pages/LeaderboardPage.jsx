import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Loader, Hash, Clock, ListOrdered } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

const LeaderboardPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(
          collection(db, 'leaderboard'),
          where('quizId', '==', id),
          orderBy('score', 'desc'),
          orderBy('completedAt', 'desc'),
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const data = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });
        
        setLeaders(data);
      } catch (err) {
        console.error("Error fetching leaderboard: ", err);
        setError("Failed to load leaderboard. Please make sure Firebase is configured.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [id]);

  return (
    <div className="w-full relative min-h-screen pb-24 -mt-8">
      {/* Top Gradient */}
      <div className="absolute top-0 left-0 w-full h-80 bg-gradient-to-b from-[#1e3a8a] to-background pointer-events-none -z-10 opacity-80" />
      
      <div className="pt-8 px-4 md:px-8 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-4 py-2 bg-black/30 hover:bg-black/50 rounded-full transition-colors text-white text-sm font-bold backdrop-blur-md"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-end mb-8 mt-12">
          <div className="w-48 h-48 bg-gradient-to-br from-primary to-secondary shadow-[0_4px_60px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center text-white shrink-0">
             <ListOrdered className="w-16 h-16 opacity-50 mb-2" />
             <span className="font-bold tracking-widest uppercase">Top 10</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-text">Public Playlist</span>
            <h1 className="text-5xl md:text-7xl font-black text-text tracking-tighter">Leaderboard</h1>
            <p className="text-sm text-text-muted font-medium mt-2">
              The highest scores and fastest times for this quiz.
            </p>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_100px_80px] gap-4 px-4 py-2 border-b border-white/10 text-xs text-text-muted uppercase tracking-widest font-semibold sticky top-0 bg-background/95 backdrop-blur-sm z-10 mb-4">
          <div className="text-center">#</div>
          <div>Title</div>
          <div className="text-right">Accuracy</div>
          <div className="text-right flex items-center justify-end"><Clock className="w-4 h-4" /></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-white" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400 bg-red-400/10 rounded-lg border border-red-400/20">
            {error}
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20 text-white/50 font-medium">
            It's quiet in here. Be the first to play!
          </div>
        ) : (
          <div className="flex flex-col">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="grid grid-cols-[40px_1fr_100px_80px] gap-4 px-4 py-3 rounded-md hover:bg-surface-hover transition-colors group items-center"
              >
                <div className="text-center text-text-muted font-medium group-hover:text-text">
                  {index + 1}
                </div>
                
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                    {leader.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-text font-bold truncate">{leader.name}</span>
                    <span className="text-xs text-text-muted truncate">{leader.quizTitle}</span>
                  </div>
                </div>
                
                <div className="text-right text-sm text-text-muted group-hover:text-text font-medium transition-colors">
                  {leader.percentage.toFixed(0)}%
                </div>

                <div className="text-right text-sm text-text-muted group-hover:text-text font-bold transition-colors">
                  {leader.score} pts
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
