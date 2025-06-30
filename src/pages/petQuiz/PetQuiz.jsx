import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../shared/navbar/Navbar';

const PetQuiz = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [matchedPets, setMatchedPets] = useState([]);

  const questions = [
    {
      id: 'activity_level',
      question: 'How active is your lifestyle?',
      options: [
        { value: 'high', label: 'Very active - I enjoy daily exercise and outdoor activities' },
        { value: 'moderate', label: 'Moderately active - I exercise occasionally' },
        { value: 'low', label: 'Relatively inactive - I prefer indoor activities' }
      ]
    },
    {
      id: 'home_space',
      question: 'What best describes your living space?',
      options: [
        { value: 'large', label: 'Large house with yard or outdoor space' },
        { value: 'medium', label: 'Medium-sized apartment or house' },
        { value: 'small', label: 'Small apartment or limited space' }
      ]
    },
    {
      id: 'allergies',
      question: 'Do you or anyone in your household have pet allergies?',
      options: [
        { value: 'none', label: 'No allergies to pets' },
        { value: 'mild', label: 'Mild allergies to some pets' },
        { value: 'severe', label: 'Severe allergies to most pets' }
      ]
    },
    {
      id: 'time_availability',
      question: 'How much time can you dedicate to pet care daily?',
      options: [
        { value: 'high', label: '4+ hours - I can provide extensive care and attention' },
        { value: 'moderate', label: '2-4 hours - I can provide regular care' },
        { value: 'low', label: '1-2 hours - I need a low-maintenance pet' }
      ]
    },
    {
      id: 'desired_personality',
      question: 'What personality traits do you prefer in a pet?',
      options: [
        { value: 'playful', label: 'Playful and energetic' },
        { value: 'calm', label: 'Calm and relaxed' },
        { value: 'independent', label: 'Independent and self-sufficient' }
      ]
    },
    {
      id: 'maintenance_preference',
      question: 'How much maintenance are you comfortable with?',
      options: [
        { value: 'high', label: 'High maintenance - I can handle regular grooming and care' },
        { value: 'moderate', label: 'Moderate maintenance - Some regular care is fine' },
        { value: 'low', label: 'Low maintenance - Minimal care preferred' }
      ]
    },
    {
      id: 'companionship_type',
      question: 'What type of companionship are you looking for?',
      options: [
        { value: 'interactive', label: 'Highly interactive and affectionate' },
        { value: 'moderate', label: 'Moderate interaction and companionship' },
        { value: 'observational', label: 'Mostly observational companionship' }
      ]
    },
    {
      id: 'household_interaction',
      question: 'Who will primarily interact with the pet?',
      options: [
        { value: 'family', label: 'Whole family, including children' },
        { value: 'adults', label: 'Adults only' },
        { value: 'single', label: 'Single person' }
      ]
    },
    {
      id: 'vet_comfort',
      question: 'How comfortable are you with regular vet visits and medical care?',
      options: [
        { value: 'very', label: 'Very comfortable - I can handle regular check-ups and care' },
        { value: 'moderate', label: 'Moderately comfortable - Basic care is fine' },
        { value: 'minimal', label: 'Prefer minimal medical care' }
      ]
    },
    {
      id: 'noise_tolerance',
      question: 'What level of noise are you comfortable with?',
      options: [
        { value: 'high', label: 'High - I can handle frequent vocalization' },
        { value: 'moderate', label: 'Moderate - Some noise is okay' },
        { value: 'low', label: 'Low - I prefer quiet pets' }
      ]
    }
  ];

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculatePetScores = (pet, answers) => {
    let score = 0;
    const category = pet.category.toLowerCase();

    // Activity Level
    if (answers.activity_level === 'high' && (category === 'dog' || category === 'bird')) {
      score += 3;
    } else if (answers.activity_level === 'moderate' && (category === 'cat' || category === 'rabbit')) {
      score += 3;
    } else if (answers.activity_level === 'low' && (category === 'fish' || category === 'reptile')) {
      score += 3;
    }

    // Home Space
    if (answers.home_space === 'large' && (category === 'dog' || category === 'bird')) {
      score += 3;
    } else if (answers.home_space === 'medium' && (category === 'cat' || category === 'rabbit')) {
      score += 3;
    } else if (answers.home_space === 'small' && (category === 'fish' || category === 'reptile')) {
      score += 3;
    }

    // Allergies
    if (answers.allergies === 'none') {
      score += 2;
    } else if (answers.allergies === 'mild' && (category === 'fish' || category === 'reptile')) {
      score += 3;
    } else if (answers.allergies === 'severe' && (category === 'fish' || category === 'reptile')) {
      score += 4;
    }

    // Time Availability
    if (answers.time_availability === 'high' && (category === 'dog' || category === 'bird')) {
      score += 3;
    } else if (answers.time_availability === 'moderate' && (category === 'cat' || category === 'rabbit')) {
      score += 3;
    } else if (answers.time_availability === 'low' && (category === 'fish' || category === 'reptile')) {
      score += 3;
    }

    // Desired Personality
    if (answers.desired_personality === 'playful' && (category === 'dog' || category === 'bird')) {
      score += 3;
    } else if (answers.desired_personality === 'calm' && (category === 'cat' || category === 'rabbit')) {
      score += 3;
    } else if (answers.desired_personality === 'independent' && (category === 'cat' || category === 'reptile')) {
      score += 3;
    }

    // Maintenance Preference
    if (answers.maintenance_preference === 'high' && (category === 'dog' || category === 'bird')) {
      score += 3;
    } else if (answers.maintenance_preference === 'moderate' && (category === 'cat' || category === 'rabbit')) {
      score += 3;
    } else if (answers.maintenance_preference === 'low' && (category === 'fish' || category === 'reptile')) {
      score += 3;
    }

    // Companionship Type
    if (answers.companionship_type === 'interactive' && (category === 'dog' || category === 'bird')) {
      score += 3;
    } else if (answers.companionship_type === 'moderate' && (category === 'cat' || category === 'rabbit')) {
      score += 3;
    } else if (answers.companionship_type === 'observational' && (category === 'fish' || category === 'reptile')) {
      score += 3;
    }

    // Household Interaction
    if (answers.household_interaction === 'family' && (category === 'dog' || category === 'rabbit')) {
      score += 3;
    } else if (answers.household_interaction === 'adults' && (category === 'cat' || category === 'bird')) {
      score += 3;
    } else if (answers.household_interaction === 'single' && (category === 'fish' || category === 'reptile')) {
      score += 3;
    }

    // Vet Comfort
    if (answers.vet_comfort === 'very' && (category === 'dog' || category === 'cat')) {
      score += 3;
    } else if (answers.vet_comfort === 'moderate' && (category === 'rabbit' || category === 'bird')) {
      score += 3;
    } else if (answers.vet_comfort === 'minimal' && (category === 'fish' || category === 'reptile')) {
      score += 3;
    }

    // Noise Tolerance
    if (answers.noise_tolerance === 'high' && (category === 'dog' || category === 'bird')) {
      score += 3;
    } else if (answers.noise_tolerance === 'moderate' && (category === 'cat' || category === 'rabbit')) {
      score += 3;
    } else if (answers.noise_tolerance === 'low' && (category === 'fish' || category === 'reptile')) {
      score += 3;
    }

    return score;
  };

  const handleSubmit = async () => {
    try {
      const baseUrl = "https://serversite-pet-adoption.vercel.app";
      const response = await fetch(`${baseUrl}/pets`);
      const allPets = await response.json();
      
      // Filter out adopted pets
      const availablePets = allPets.filter(pet => !pet.adopted);
      
      // Score each pet based on user preferences
      const scoredPets = availablePets.map(pet => ({
        ...pet,
        matchScore: calculatePetScores(pet, answers)
      }));
      
      // Sort pets by match score and get top 6 matches
      const matchedPets = scoredPets
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 6)
        .map(({ matchScore, ...pet }) => pet); // Remove matchScore from response
      
      setMatchedPets(matchedPets);
      setShowResults(true);
    } catch (error) {
      console.error('Error matching pets:', error);
      alert('Error finding matches. Please try again.');
    }
  };

  const handleStartOver = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
    setMatchedPets([]);
  };

  if (showResults) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-center mb-8">Your Perfect Pet Matches</h2>
          {matchedPets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchedPets.map((pet) => (
                <div key={pet._id} className="card bg-base-100 shadow-xl">
                  <figure>
                    <img src={pet.image} alt={pet.name} className="w-full h-48 object-cover" />
                  </figure>
                  <div className="card-body">
                    <h3 className="card-title">{pet.name}</h3>
                    <p>Age: {pet.age}</p>
                    <p>Location: {pet.location}</p>
                    <p>Category: {pet.category}</p>
                    <div className="card-actions justify-end">
                      <button
                        onClick={() => navigate(`/adoptpet/${pet._id}`)}
                        className="btn btn-primary"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-xl mb-4">No exact matches found, but here are some suggestions:</p>
              <p className="text-gray-600 mb-8">
                Consider adjusting your preferences or exploring different pet types.
              </p>
            </div>
          )}
          <div className="text-center mt-8">
            <button
              onClick={handleStartOver}
              className="btn btn-primary"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Find Your Perfect Pet Match</h2>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {currentStep + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(((currentStep + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">{questions[currentStep].question}</h3>
            <div className="space-y-3">
              {questions[currentStep].options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(questions[currentStep].id, option.value)}
                  className={`w-full p-4 text-left rounded-lg border ${
                    answers[questions[currentStep].id] === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className={`px-6 py-2 rounded-lg ${
                  currentStep === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!answers[questions[currentStep].id]}
                className={`px-6 py-2 rounded-lg ${
                  !answers[questions[currentStep].id]
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {currentStep === questions.length - 1 ? 'Find Matches' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetQuiz; 