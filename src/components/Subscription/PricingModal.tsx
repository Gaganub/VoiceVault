import React, { useState } from 'react';
import { X, Check, Crown, Users, Building, Sparkles } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSelectPlan }) => {
  const { theme } = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<string>('premium');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (!isOpen) return null;

  const plans = [
    {
      id: 'free',
      name: 'Free',
      icon: Sparkles,
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        '50 memories per month',
        'Basic voice recording',
        'Simple search',
        'Mobile app access',
        'Basic themes'
      ],
      limitations: [
        'No AI avatar',
        'No blockchain security',
        'Limited storage'
      ],
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      icon: Crown,
      price: { monthly: 9.99, yearly: 99.99 },
      description: 'For serious memory keepers',
      features: [
        'Unlimited memories',
        'AI video avatar',
        'Advanced voice processing',
        'Blockchain security',
        'Smart search & insights',
        'All premium themes',
        'Export capabilities',
        'Priority support'
      ],
      limitations: [],
      popular: true,
    },
    {
      id: 'family',
      name: 'Family',
      icon: Users,
      price: { monthly: 19.99, yearly: 199.99 },
      description: 'Share memories with loved ones',
      features: [
        'Everything in Premium',
        'Up to 6 family members',
        'Shared memory vaults',
        'Multiple AI avatars',
        'Family timeline',
        'Collaborative features',
        'Parental controls',
        'Family insights'
      ],
      limitations: [],
      popular: false,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      icon: Building,
      price: { monthly: 49.99, yearly: 499.99 },
      description: 'For teams and organizations',
      features: [
        'Everything in Family',
        'Unlimited team members',
        'Advanced analytics',
        'Custom integrations',
        'API access',
        'White-label options',
        'Dedicated support',
        'Custom training'
      ],
      limitations: [],
      popular: false,
    },
  ];

  const handleSelectPlan = (planId: string) => {
    onSelectPlan(planId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backgroundColor: `${theme.colors.background}80` }}
        onClick={onClose}
      ></div>
      
      <div 
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl backdrop-blur-sm border border-opacity-20"
        style={{ 
          backgroundColor: `${theme.colors.surface}95`,
          borderColor: theme.colors.accent 
        }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-opacity-20" style={{ borderColor: theme.colors.accent }}>
          <div>
            <h2 
              className="text-2xl font-bold"
              style={{ color: theme.colors.text }}
            >
              Choose Your Plan
            </h2>
            <p 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              Unlock the full potential of your memory vault
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{ backgroundColor: `${theme.colors.surface}40` }}
          >
            <X 
              className="w-5 h-5" 
              style={{ color: theme.colors.textSecondary }}
            />
          </button>
        </div>

        <div className="p-6">
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div 
              className="flex items-center p-1 rounded-xl backdrop-blur-sm border border-opacity-20"
              style={{ 
                backgroundColor: `${theme.colors.surface}40`,
                borderColor: theme.colors.accent 
              }}
            >
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  billingCycle === 'monthly' ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: billingCycle === 'monthly' ? theme.colors.primary : 'transparent',
                  color: billingCycle === 'monthly' ? theme.colors.background : theme.colors.textSecondary,
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  billingCycle === 'yearly' ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: billingCycle === 'yearly' ? theme.colors.primary : 'transparent',
                  color: billingCycle === 'yearly' ? theme.colors.background : theme.colors.textSecondary,
                }}
              >
                Yearly
                <span 
                  className="ml-2 px-2 py-1 text-xs rounded-full"
                  style={{ 
                    backgroundColor: theme.colors.accent,
                    color: theme.colors.text 
                  }}
                >
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative p-6 rounded-2xl backdrop-blur-sm border-2 transition-all duration-300 hover:scale-105 ${
                  plan.popular ? 'scale-105' : ''
                }`}
                style={{
                  backgroundColor: `${theme.colors.surface}40`,
                  borderColor: plan.popular ? theme.colors.primary : theme.colors.accent,
                }}
              >
                {plan.popular && (
                  <div 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                    style={{ 
                      backgroundColor: theme.colors.primary,
                      color: theme.colors.background 
                    }}
                  >
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ backgroundColor: `${theme.colors.primary}20` }}
                  >
                    <plan.icon 
                      className="w-6 h-6" 
                      style={{ color: theme.colors.primary }}
                    />
                  </div>
                  
                  <h3 
                    className="text-xl font-bold mb-2"
                    style={{ color: theme.colors.text }}
                  >
                    {plan.name}
                  </h3>
                  
                  <p 
                    className="text-sm mb-4"
                    style={{ color: theme.colors.textSecondary }}
                  >
                    {plan.description}
                  </p>

                  <div className="mb-4">
                    <span 
                      className="text-3xl font-bold"
                      style={{ color: theme.colors.text }}
                    >
                      ${plan.price[billingCycle]}
                    </span>
                    <span 
                      className="text-sm"
                      style={{ color: theme.colors.textSecondary }}
                    >
                      /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check 
                        className="w-4 h-4 flex-shrink-0" 
                        style={{ color: theme.colors.primary }}
                      />
                      <span 
                        className="text-sm"
                        style={{ color: theme.colors.text }}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  className="w-full py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: plan.popular ? theme.colors.primary : `${theme.colors.primary}20`,
                    color: plan.popular ? theme.colors.background : theme.colors.primary,
                  }}
                >
                  {plan.id === 'free' ? 'Current Plan' : 'Choose Plan'}
                </button>
              </div>
            ))}
          </div>

          {/* Features Comparison */}
          <div className="mt-12 text-center">
            <p 
              className="text-sm"
              style={{ color: theme.colors.textSecondary }}
            >
              All plans include 30-day money-back guarantee • Cancel anytime • Secure payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};