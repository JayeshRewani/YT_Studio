import express from 'express';
import Generation from '../models/Generation.js';
import auth from '../middleware/auth.js';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

// AI Generation functions (same as before but adapted for MongoDB)
const generateTitles = (data) => {
  const { topic, tone, videoType, maxLength } = data;
  
  const baseTitles = [
    `${topic} - Complete Guide`,
    `How to ${topic.toLowerCase()} (Step by Step)`,
    `${topic} | Proven Strategy`,
    `The Ultimate ${topic} Tutorial`,
    `${topic} - What Nobody Tells You`
  ];

  const toneModifiers = {
    clickbait: ['SHOCKING', 'INSANE', 'MIND-BLOWING', 'CRAZY', 'UNBELIEVABLE'],
    educational: ['Complete Guide', 'Step by Step', 'Tutorial', 'Explained', 'Masterclass'],
    professional: ['Strategy', 'Framework', 'Method', 'System', 'Approach'],
    humorous: ['LOL', 'HILARIOUS', 'FUNNY', 'EPIC FAIL', 'ROASTED'],
    motivational: ['UNSTOPPABLE', 'POWERFUL', 'INSPIRING', 'LIFE-CHANGING', 'TRANSFORM']
  };

  const modifiers = toneModifiers[tone] || toneModifiers.educational;

  return baseTitles.map((title, index) => {
    let modifiedTitle = title;
    
    if (tone === 'clickbait') {
      modifiedTitle = `${modifiers[index % modifiers.length]} ${title}`;
    } else if (tone === 'motivational') {
      modifiedTitle = `${title} | ${modifiers[index % modifiers.length]}`;
    }

    if (modifiedTitle.length > maxLength) {
      modifiedTitle = modifiedTitle.substring(0, maxLength - 3) + '...';
    }

    return {
      title: modifiedTitle,
      score: Math.floor(Math.random() * 30) + 70,
      emotional: Math.floor(Math.random() * 40) + 60,
      clarity: Math.floor(Math.random() * 30) + 70,
      clickbait: Math.floor(Math.random() * 50) + 50
    };
  });
};

const generateDescription = (data) => {
  const { topic, keywords, videoType } = data;
  
  return `🎯 ${topic}

In this ${videoType}, you'll learn everything you need to know about ${topic.toLowerCase()}. Whether you're a beginner or looking to improve your skills, this comprehensive guide will help you achieve your goals.

🔥 What You'll Learn:
• Key strategies and techniques
• Step-by-step implementation
• Common mistakes to avoid
• Pro tips and best practices
• Real-world examples and case studies

⏰ Timestamps:
00:00 - Introduction
02:30 - Getting Started
05:45 - Core Concepts
10:20 - Advanced Techniques
15:30 - Common Mistakes
18:45 - Final Tips
20:00 - Conclusion

🚀 Ready to take your skills to the next level? Make sure to:
👍 LIKE this video if it helped you
🔔 SUBSCRIBE for more tutorials
💬 COMMENT your questions below
📱 SHARE with your friends

Keywords: ${keywords || topic}

📞 Connect with me:
🌐 Website: [Your Website]
📧 Email: [Your Email]
📱 Instagram: @[Your Handle]
🐦 Twitter: @[Your Handle]
💼 LinkedIn: [Your Profile]

#${topic.replace(/\s+/g, '')} #Tutorial #${videoType.charAt(0).toUpperCase() + videoType.slice(1)}

---
📝 Resources mentioned in this video:
• [Resource 1]
• [Resource 2]
• [Resource 3]

🎵 Music: [If applicable]
🎬 Edited with: [Your editing software]

⚠️ Disclaimer: [Add any necessary disclaimers]

Thanks for watching! See you in the next video! 🎬`;
};

const generateTags = (data) => {
  const { topic, keywords, videoType } = data;
  
  const baseTags = [
    topic.toLowerCase(),
    `${topic.toLowerCase()} tutorial`,
    `${topic.toLowerCase()} guide`,
    `how to ${topic.toLowerCase()}`,
    videoType,
    `${videoType} tutorial`
  ];

  const additionalTags = [
    'youtube growth', 'content creation', 'social media', 'online marketing',
    'digital marketing', 'seo', 'viral content', 'engagement'
  ];

  const allTags = [...baseTags, ...additionalTags];
  
  return allTags.slice(0, 15).map(tag => ({
    tag: tag.replace(/\s+/g, ''),
    competition: Math.random() > 0.6 ? 'high' : Math.random() > 0.3 ? 'medium' : 'low',
    trending: Math.random() > 0.7
  }));
};

const generateKeywords = (data) => {
  const { topic } = data;
  
  const baseKeywords = [
    topic.toLowerCase(),
    `${topic.toLowerCase()} tips`,
    `${topic.toLowerCase()} strategy`,
    `${topic.toLowerCase()} guide`,
    `${topic.toLowerCase()} tutorial`,
    `how to ${topic.toLowerCase()}`,
    `${topic.toLowerCase()} for beginners`,
    `${topic.toLowerCase()} advanced`,
    `${topic.toLowerCase()} 2024`,
    `${topic.toLowerCase()} step by step`
  ];

  const volumes = ['1K-10K', '10K-100K', '100K-1M', '1M+'];
  const difficulties = ['easy', 'medium', 'hard'];

  return baseKeywords.map(keyword => ({
    keyword,
    volume: volumes[Math.floor(Math.random() * volumes.length)],
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    trending: Math.random() > 0.8
  }));
};

// Generate content
router.post('/generate', auth, async (req, res) => {
  try {
    const { topic, videoType, tone, maxLength, keywords } = req.body;

    // Validation
    if (!topic || !videoType || !tone) {
      return res.status(400).json({ 
        error: 'Topic, video type, and tone are required' 
      });
    }

    // Check user credits
    if (req.user.creditsRemaining <= 0) {
      return res.status(403).json({ 
        error: 'Insufficient credits. Please upgrade your plan.' 
      });
    }

    // Generate content
    const titles = generateTitles({ topic, tone, videoType, maxLength });
    const description = generateDescription({ topic, keywords, videoType });
    const tags = generateTags({ topic, keywords, videoType });
    const generatedKeywords = generateKeywords({ topic, keywords });

    // Save generation to database
    const generation = new Generation({
      userId: req.user._id,
      topic,
      videoType,
      tone,
      generatedTitles: titles,
      generatedDescription: description,
      generatedTags: tags,
      generatedKeywords: generatedKeywords
    });

    await generation.save();

    // Update user credits
    await req.user.updateCredits(1);

    res.json({
      titles,
      description,
      tags,
      keywords: generatedKeywords,
      creditsRemaining: req.user.creditsRemaining - 1
    });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Server error during content generation' 
    });
  }
});

// Get user's generation history
router.get('/history', auth, async (req, res) => {
  try {
    const generations = await Generation.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ generations });
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ 
      error: 'Server error fetching generation history' 
    });
  }
});

export default router;