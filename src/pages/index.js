import { useState, useEffect } from 'react';
import Image from 'next/image';

// Sample function to fetch SVG content (you can adapt this based on your server or API setup)
async function fetchBadgeSvg(badgeName) {
  try {
    const response = await fetch(`/svg/badges/${badgeName.replace(/\s/g, '-').toLowerCase()}.svg`);
    if (!response.ok) {
      throw new Error('Failed to fetch badge SVG');
    }
    const svgContent = await response.text();
    return svgContent;
  } catch (error) {
    console.error('Error fetching badge SVG:', error);
    return null;
  }
}

export default function Home() {
  const [userId, setUserId] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false); // Buton yükleme durumu
  const [showModal, setShowModal] = useState(false); // Captcha modal durumu
  const [captchaNum1, setCaptchaNum1] = useState(0); // Captcha sayıları
  const [captchaNum2, setCaptchaNum2] = useState(0);
  const [captchaOperation, setCaptchaOperation] = useState('+');
  const [captchaInput, setCaptchaInput] = useState(''); // Captcha kullanıcı girişi
  const [captchaAnswer, setCaptchaAnswer] = useState(0); // Captcha doğru cevap
  const [manualData, setManualData] = useState(null); // Manuel olarak eklenen veri

  useEffect(() => {
    const lang = navigator.language || navigator.userLanguage;
    setLanguage(lang.startsWith('tr') ? 'tr' : 'en');
    fetchSampleUserData(); // Sayfa yüklendiğinde örnek kullanıcı verisi çağır
  }, []);

  // Örnek kullanıcı verisi çağırma işlevi
  const fetchSampleUserData = async () => {
    try {
      const sampleData = {
        id: '1234567890',
        username: 'Örnek Gösterim',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
        badges: ['Discord Staff'],
        banner_url: 'https://assets-global.website-files.com/5f9072399b2640f14d6a2bf4/611af00d256b9e541fac258f_0_4clCON4Ko2L_PqGi.png',
        created_at: new Date().toISOString(),
        banner_color: '#abcdef'
      };
      setManualData(sampleData);
    } catch (error) {
      console.error('Error fetching sample user data:', error);
      setError(language === 'tr' ? 'Örnek kullanıcı verisi alınırken bir hata oluştu.' : 'An error occurred while fetching sample user data.');
    }
  };

  // Captcha oluşturma işlevi
  const fetchCaptcha = async () => {
    try {
      const num1 = Math.floor(Math.random() * 10);
      const num2 = Math.floor(Math.random() * 10);
      const answer = num1 + num2;

      setCaptchaNum1(num1);
      setCaptchaNum2(num2);
      setCaptchaOperation('+');
      setCaptchaAnswer(answer);
    } catch (error) {
      console.error('Error generating captcha:', error);
      setError(language === 'tr' ? 'Captcha oluşturma hatası.' : 'Error generating captcha.');
    }
  };

  // Captcha doğrulama işlevi
  const handleCaptchaSuccess = async () => {
    if (parseInt(captchaInput) !== captchaAnswer) {
      setError(language === 'tr' ? 'Captcha doğrulaması başarısız.' : 'Captcha verification failed.');
      return;
    }

    try {
      setLoading(true); // Buton yükleme durumu
      setShowModal(false); // Captcha modalini kapat
      const response = await fetch(`/api/lookup?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setError(null);

        // Preload user badges
        if (data && data.badges) {
          await Promise.all(data.badges.map(async (badge) => {
            const svgContent = await fetchBadgeSvg(badge);
            if (!svgContent) {
              console.error(`Failed to fetch badge SVG for ${badge}`);
            }
          }));
        }

      } else {
        setError(`${language === 'tr' ? 'Hata:' : 'Error:'} ${response.status} ${response.statusText}`);
        setUserData(null);
      }
    } catch (error) {
      setError(language === 'tr' ? 'Veri alınırken bir hata oluştu.' : 'An error occurred while fetching data.');
      setUserData(null);
    } finally {
      setLoading(false); // Buton yükleme durumu sıfırla
    }
  };

  const getBadgeSvg = (badgeName) => {
    return `/svg/badges/${badgeName.replace(/\s/g, '-').toLowerCase()}.svg`;
  };

  // Kullanıcıya gösterilecek ana bileşen
  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-6">
          {language === 'tr' ? 'Resmi Olmayan Discord Sorgulama' : 'Unofficial Discord Lookup'}
        </h1>
        <input
          type="text"
          placeholder={language === 'tr' ? 'Kullanıcı ID / Herhangi bir ID' : 'User ID / Any ID'}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded"
        />
        <button
          onClick={() => { fetchCaptcha(); setShowModal(true); }}
          className={`w-full bg-blue-600 hover:bg-blue-700 p-2 rounded text-white font-bold ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Yükleniyor...' : language === 'tr' ? 'Sorgula' : 'Lookup'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        {(userData || manualData) && (
          <div className="mt-10 bg-gray-800 p-6 rounded-lg shadow-md text-left">
            <div className="flex items-center mb-4">
              <div className="relative h-24 w-24 mr-4">
                <Image
                  src={(userData && userData.avatar_url) || (manualData && manualData.avatar_url)}
                  alt={language === 'tr' ? 'Discord Profil Resmi' : 'Discord Profile Picture'}
                  layout="fill"
                  className="rounded-full"
                  unoptimized
                />
              </div>
              <div>
                <h2 className="text-xl font-bold">{(userData && userData.username) || (manualData && manualData.username)}</h2>
                <p className="text-gray-400">
                  {language === 'tr' ? 'Kullanıcı ID:' : 'User ID:'} {(userData && userData.id) || (manualData && manualData.id)}
                </p>
              </div>
            </div>
            {(userData && userData.badges) || (manualData && manualData.badges) ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {(userData ? userData.badges : manualData.badges).map((badge, index) => (
                  <div key={index} className="flex items-center">
                    <Image
                      src={getBadgeSvg(badge)}
                      alt={badge}
                      width={24}
                      height={24}
                      className="mr-2 rounded-full"
                      unoptimized
                    />
                    <span className="bg-gray-700 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
                      {badge}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
            {(userData && userData.banner_url) || (manualData && manualData.banner_url) ? (
              <div className="mb-4">
                <Image
                  src={(userData && userData.banner_url) || (manualData && manualData.banner_url)}
                  alt={language === 'tr' ? 'Discord Afiş' : 'Discord Banner'}
                  width={600}
                  height={200}
                  className="rounded"
                  unoptimized
                />
              </div>
            ) : null}
            <p className="text-gray-400 mb-2">
              <span className="font-bold">
                {language === 'tr' ? 'Oluşturulma Tarihi:' : 'Created:'}
              </span> {(userData && new Date(userData.created_at).toLocaleString(language)) || (manualData && new Date(manualData.created_at).toLocaleString(language))}
            </p>
            {(userData && userData.banner_color) || (manualData && manualData.banner_color) ? (
              <p className="text-gray-400 mb-2">
                <span className="font-bold">
                  {language === 'tr' ? 'Afiş Rengi:' : 'Banner Color:'}
                </span> 
                <span style={{ backgroundColor: (userData && userData.banner_color) || (manualData && manualData.banner_color) }} className="ml-2 p-1 rounded">{(userData && userData.banner_color) || (manualData && manualData.banner_color)}</span>
              </p>
            ) : null}
          </div>
        )}
        {/* Captcha modal */}
        {showModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-gray-700 text-xl font-bold mb-4">{language === 'tr' ? 'Captcha Doğrulaması' : 'Captcha Verification'}</h2>
              <p className="mb-4 text-gray-700" >{captchaNum1} {captchaOperation} {captchaNum2} = ?</p>
              <input
                type="number"
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="text-gray-700 w-full p-2 mb-4 bg-gray-100 border border-gray-300 rounded"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleCaptchaSuccess}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                >
                  {language === 'tr' ? 'Onayla' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
