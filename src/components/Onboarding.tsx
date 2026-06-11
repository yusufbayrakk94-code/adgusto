import React, { useState } from 'react';
import { Building2, Target, Users, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useLanguage } from '../hooks/useLanguage';

interface OnboardingProps {
  userId: string;
  userEmail: string;
  onComplete: () => void;
}

interface OnboardingData {
  businessName: string;
  industry: string;
  businessSize: string;
  monthlyBudget: string;
  goals: string[];
  challenges: string[];
}

const INDUSTRIES = [
  { value: 'ecommerce', label: 'E-Ticaret', icon: '🛒' },
  { value: 'health', label: 'Sağlık & Turizm', icon: '🏥' },
  { value: 'consulting', label: 'Danışmanlık', icon: '💼' },
  { value: 'tech', label: 'Teknoloji & SaaS', icon: '💻' },
  { value: 'food', label: 'Yiyecek & İçecek', icon: '🍔' },
  { value: 'fashion', label: 'Moda & Giyim', icon: '👗' },
  { value: 'education', label: 'Eğitim', icon: '📚' },
  { value: 'other', label: 'Diğer', icon: '✨' },
];

const BUSINESS_SIZES = [
  { value: 'solo', label: 'Bireysel / Solo', desc: '1 kişi' },
  { value: 'small', label: 'Küçük İşletme', desc: '2-10 kişi' },
  { value: 'medium', label: 'Orta Ölçekli', desc: '11-50 kişi' },
  { value: 'large', label: 'Büyük İşletme', desc: '50+ kişi' },
];

const BUDGETS = [
  { value: 'under-1k', label: '1.000₺ altı' },
  { value: '1k-5k', label: '1.000₺ - 5.000₺' },
  { value: '5k-20k', label: '5.000₺ - 20.000₺' },
  { value: '20k-50k', label: '20.000₺ - 50.000₺' },
  { value: 'over-50k', label: '50.000₺ üzeri' },
];

const GOALS = [
  { value: 'awareness', label: 'Marka Bilinirliği', icon: '📢' },
  { value: 'leads', label: 'Potansiyel Müşteri', icon: '🎯' },
  { value: 'sales', label: 'Satış Artırma', icon: '💰' },
  { value: 'traffic', label: 'Web Trafiği', icon: '🚀' },
  { value: 'engagement', label: 'Etkileşim', icon: '❤️' },
  { value: 'conversion', label: 'Dönüşüm Oranı', icon: '📈' },
];

const CHALLENGES = [
  { value: 'targeting', label: 'Doğru Hedef Kitle', icon: '🎯' },
  { value: 'content', label: 'İçerik Üretimi', icon: '✍️' },
  { value: 'budget', label: 'Bütçe Yönetimi', icon: '💸' },
  { value: 'analytics', label: 'Analiz & Raporlama', icon: '📊' },
  { value: 'strategy', label: 'Strateji Geliştirme', icon: '🧠' },
  { value: 'time', label: 'Zaman Yönetimi', icon: '⏰' },
];

export const Onboarding: React.FC<OnboardingProps> = ({ userId, userEmail, onComplete }) => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    businessName: '',
    industry: '',
    businessSize: '',
    monthlyBudget: '',
    goals: [],
    challenges: [],
  });

  const totalSteps = 5;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleToggleMultiple = (field: 'goals' | 'challenges', value: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      await setDoc(doc(db, 'users', userId), {
        email: userEmail,
        businessName: data.businessName,
        industry: data.industry,
        businessSize: data.businessSize,
        monthlyBudget: data.monthlyBudget,
        goals: data.goals,
        challenges: data.challenges,
        onboardingCompleted: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      console.log('Onboarding completed successfully');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      alert(t('common.error'));
      setLoading(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.businessName.trim().length > 0;
      case 2:
        return data.industry.length > 0;
      case 3:
        return data.businessSize.length > 0;
      case 4:
        return data.goals.length > 0;
      case 5:
        return data.challenges.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-primary/10 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-dark">AdGusto</h1>
          <p className="text-gray mt-2">Hadi sizi tanıyalım!</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-gray">Adım {step} / {totalSteps}</span>
              <span className="text-sm font-bold text-primary">{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Business Name */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">İşletmenizin Adı Nedir?</h2>
                <p className="text-gray">Marka veya işletme adınızı yazın</p>
              </div>

              <div>
                <input
                  type="text"
                  value={data.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  placeholder="örn: AdGusto Ajans"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Industry */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Hangi Sektördesiniz?</h2>
                <p className="text-gray">İşletmenizin sektörünü seçin</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {INDUSTRIES.map(industry => (
                  <button
                    key={industry.value}
                    onClick={() => setData({ ...data, industry: industry.value })}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      data.industry === industry.value
                        ? 'border-primary bg-primary/20 shadow-md'
                        : 'border-gray-200 hover:border-primary/50 hover:shadow'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{industry.icon}</span>
                    <span className="text-sm font-bold text-dark">{industry.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Business Size */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">İşletmenizin Büyüklüğü?</h2>
                <p className="text-gray">Ekip büyüklüğünüzü seçin</p>
              </div>

              <div className="space-y-3">
                {BUSINESS_SIZES.map(size => (
                  <button
                    key={size.value}
                    onClick={() => setData({ ...data, businessSize: size.value })}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      data.businessSize === size.value
                        ? 'border-primary bg-primary/20 shadow-md'
                        : 'border-gray-200 hover:border-primary/50 hover:shadow'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-dark">{size.label}</div>
                        <div className="text-sm text-gray">{size.desc}</div>
                      </div>
                      {data.businessSize === size.value && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-bold text-dark mb-3">Aylık Reklam Bütçeniz</h3>
                <div className="grid grid-cols-2 gap-3">
                  {BUDGETS.map(budget => (
                    <button
                      key={budget.value}
                      onClick={() => setData({ ...data, monthlyBudget: budget.value })}
                      className={`p-3 rounded-xl border-2 transition-all text-center text-sm font-bold ${
                        data.monthlyBudget === budget.value
                          ? 'border-primary bg-primary/20'
                          : 'border-gray-200 hover:border-primary/50'
                      }`}
                    >
                      {budget.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Pazarlama Hedefleriniz?</h2>
                <p className="text-gray">Birden fazla seçebilirsiniz</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {GOALS.map(goal => (
                  <button
                    key={goal.value}
                    onClick={() => handleToggleMultiple('goals', goal.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                      data.goals.includes(goal.value)
                        ? 'border-primary bg-primary/20 shadow-md'
                        : 'border-gray-200 hover:border-primary/50 hover:shadow'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{goal.icon}</span>
                    <span className="text-sm font-bold text-dark">{goal.label}</span>
                    {data.goals.includes(goal.value) && (
                      <CheckCircle className="w-5 h-5 text-primary absolute top-2 right-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Challenges */}
          {step === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-dark mb-2">Zorlandığınız Konular?</h2>
                <p className="text-gray">Size nasıl yardımcı olabiliriz?</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {CHALLENGES.map(challenge => (
                  <button
                    key={challenge.value}
                    onClick={() => handleToggleMultiple('challenges', challenge.value)}
                    className={`p-4 rounded-xl border-2 transition-all text-left relative ${
                      data.challenges.includes(challenge.value)
                        ? 'border-primary bg-primary/20 shadow-md'
                        : 'border-gray-200 hover:border-primary/50 hover:shadow'
                    }`}
                  >
                    <span className="text-2xl mb-2 block">{challenge.icon}</span>
                    <span className="text-sm font-bold text-dark">{challenge.label}</span>
                    {data.challenges.includes(challenge.value) && (
                      <CheckCircle className="w-5 h-5 text-primary absolute top-2 right-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-100 text-dark font-bold rounded-xl hover:bg-gray-200 transition-all"
              >
                {t('common.back')}
              </button>
            )}

            {step < totalSteps ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1 bg-primary text-dark font-bold py-4 rounded-xl hover:bg-secondary transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>İleri</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={!isStepValid() || loading}
                className="flex-1 bg-primary text-dark font-bold py-4 rounded-xl hover:bg-secondary transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-dark/30 border-t-dark rounded-full animate-spin" />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>{t('common.save')}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
