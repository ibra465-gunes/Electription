import './CandidateAvatar.css';

const CandidateAvatar = ({ name, size = 'medium' }) => {
  // Generate avatar based on name with more diverse options
  const generateAvatar = (candidateName) => {
    if (!candidateName) return "👤";

    // Create a simple hash from the name for consistent avatar selection
    let hash = 0;
    for (let i = 0; i < candidateName.length; i++) {
      const char = candidateName.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Use absolute value of hash to select avatar
    const avatarIndex = Math.abs(hash) % avatarList.length;
    return avatarList[avatarIndex];
  };

  // Diverse avatar list for better representation
  const avatarList = [
    '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍⚕️', '👩‍⚕️',
    '👨‍🔬', '👩‍🔬', '👨‍💻', '👩‍💻', '👨‍🎨', '👩‍🎨',
    '👨‍🏫', '👩‍🏫', '👨‍⚖️', '👩‍⚖️', '👨‍🌾', '👩‍🌾',
    '👨‍🍳', '👩‍🍳', '👨‍🔧', '👩‍🔧', '👨‍✈️', '👩‍✈️',
    '👨‍🚀', '👩‍🚀', '👨‍🎤', '👩‍🎤', '👨‍🏭', '👩‍🏭',
    '👨‍💳', '👩‍💳', '👨‍🌟', '👩‍🌟', '🧑‍💼', '🧑‍🎓',
    '🧑‍⚕️', '🧑‍🔬', '🧑‍💻', '🧑‍🎨', '🧑‍🏫', '🧑‍⚖️'
  ];

  const avatar = generateAvatar(name);

  return (
    <div className={`candidate-avatar ${size}`}>
      {avatar}
    </div>
  );
};

export default CandidateAvatar;
