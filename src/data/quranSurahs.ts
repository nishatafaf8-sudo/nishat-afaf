export interface QuranAyah {
  ayahNumber: number;
  arabic: string;
  banglaPronunciation: string;
  banglaMeaning: string;
}

export interface QuranSurahPart {
  surahNumber: number;
  surahName: string;
  arabicTitle: string;
  banglaName: string;
  audioUrl: string;
  ayahs: QuranAyah[];
}

export interface QuranTrack {
  id: string;
  isPairedShortSurah: boolean;
  surahName: string;
  arabicTitle: string;
  reciter: string;
  durationLabel: string;
  surahs: QuranSurahPart[];
  reflectionEnglish: string;
  reflectionBangla: string;
}

const AL_FATIHAH: QuranSurahPart = {
  surahNumber: 1,
  surahName: 'Surah Al-Fatihah',
  arabicTitle: 'سُورَةُ ٱلْفَاتِحَةِ',
  banglaName: 'সূরা আল-ফাতিহা (৭ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      banglaPronunciation: 'বিসমিল্লা-হির রাহমা-নির রাহীম',
      banglaMeaning: 'শুরু করছি আল্লাহর নামে যিনি পরম করুণাময়, অতি দয়ালু।',
    },
    {
      ayahNumber: 2,
      arabic: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
      banglaPronunciation: 'আলহামদু লিল্লা-হি রাব্বিল আ-লামীন',
      banglaMeaning: 'যাবতীয় প্রশংসা আল্লাহ তাআলার, যিনি সকল সৃষ্টি জগতের পালনকর্তা।',
    },
    {
      ayahNumber: 3,
      arabic: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
      banglaPronunciation: 'আর-রাহমা-নির রাহীম',
      banglaMeaning: 'যিনি নিতান্ত মেহেরবান ও দয়ালু।',
    },
    {
      ayahNumber: 4,
      arabic: 'مَٰلِكِ يَوْمِ ٱلدِّينِ',
      banglaPronunciation: 'মা-লিকি ইয়াওমিদ্দীন',
      banglaMeaning: 'যিনি বিচার দিনের মালিক।',
    },
    {
      ayahNumber: 5,
      arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
      banglaPronunciation: 'ইয়্যা-কা না’বুদু ওয়া ইয়্যা-কা নাসতাঈন',
      banglaMeaning: 'আমরা একমাত্র তোমারই ইবাদত করি এবং শুধুমাত্র তোমারই সাহায্য প্রার্থনা করি।',
    },
    {
      ayahNumber: 6,
      arabic: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
      banglaPronunciation: 'ইহদিনাস সিরা-তাল মুসতাক্বীম',
      banglaMeaning: 'আমাদেরকে সরল পথ দেখাও।',
    },
    {
      ayahNumber: 7,
      arabic: 'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
      banglaPronunciation: 'সিরা-তাল্লাযীনা আন’আমতা আলাইহিম, গাইরিল মাগদূবি আলাইহিম ওয়া লাদ-দ-ল্লীন',
      banglaMeaning: 'সে সমস্ত লোকের পথ, যাদেরকে তুমি নেয়ামত দান করেছ। তাদের পথ নয়, যাদের প্রতি তোমার গজব নাযিল হয়েছে এবং যারা পথভ্রষ্ট হয়েছে।',
    },
  ],
};

const AL_ASR: QuranSurahPart = {
  surahNumber: 103,
  surahName: 'Surah Al-Asr',
  arabicTitle: 'سُورَةُ العَصۡرِ',
  banglaName: 'সূরা আল-আসর (৩ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/103.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'وَٱلْعَصْرِ',
      banglaPronunciation: 'ওয়াল আসর',
      banglaMeaning: 'কসম যুগের (সময়ের),',
    },
    {
      ayahNumber: 2,
      arabic: 'إِنَّ ٱلْإِنسَٰنَ لَفِى خُسْرٍ',
      banglaPronunciation: 'ইন্নাল ইনসা-না লাফী খুসর',
      banglaMeaning: 'নিশ্চয় মানুষ ক্ষতিগ্রস্ত;',
    },
    {
      ayahNumber: 3,
      arabic: 'إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ وَتَوَاصَوْا۟ بِٱلْحَقِّ وَتَوَاصَوْا۟ بِٱلصَّبْرِ',
      banglaPronunciation: 'ইল্লাল্লাযীনা আ-মানূ ওয়া আমিলুস সা-লিহা-তি ওয়া তাওয়া-সাও বিল হাক্কি ওয়া তাওয়া-সাও বিস-সাবর',
      banglaMeaning: 'কিন্তু তারা নয়, যারা বিশ্বাস স্থাপন করে ও সৎকর্ম করে এবং পরস্পরকে তাকীদ করে সত্যের এবং তাকীদ করে সবরের।',
    },
  ],
};

const AD_DUHA: QuranSurahPart = {
  surahNumber: 93,
  surahName: 'Surah Ad-Duha',
  arabicTitle: 'سُورَةُ الضُّحَىٰ',
  banglaName: 'সূরা আদ-দুহা (১১ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/93.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'وَٱلضُّحَىٰ',
      banglaPronunciation: 'ওয়াদ-দুহা',
      banglaMeaning: 'শপথ পূর্বাহ্নের,',
    },
    {
      ayahNumber: 2,
      arabic: 'وَٱلَّيْلِ إِذَا سَجَىٰ',
      banglaPronunciation: 'ওয়াল-লাইলি ইযা- সাজা',
      banglaMeaning: 'শপথ রাত্রির যখন তা গভীর হয়,',
    },
    {
      ayahNumber: 3,
      arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ',
      banglaPronunciation: 'মা- ওয়াদ্দা’আকা রাব্বুকা ওয়া মা- ক্বালা',
      banglaMeaning: 'আপনার পালনকর্তা আপনাকে ত্যাগ করেননি এবং আপনার প্রতি বিরূপও হননি।',
    },
    {
      ayahNumber: 4,
      arabic: 'وَلَلْءَاخِرَةُ خَيْرٌۭ لَّكَ مِنَ ٱلْأُولَىٰ',
      banglaPronunciation: 'ওয়া লাল-আ-খিরাতু খাইরুল লাকা মিনাল ঊলা',
      banglaMeaning: 'আপনার জন্যে পরকাল ইহকাল অপেক্ষা শ্রেয়।',
    },
    {
      ayahNumber: 5,
      arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰٓ',
      banglaPronunciation: 'ওয়া লাসাওফা ইউ’তীকা রাব্বুকা ফাতারদা',
      banglaMeaning: 'আপনার পালনকর্তা সত্বরই আপনাকে দান করবেন, অতঃপর আপনি সন্তুষ্ট হবেন।',
    },
    {
      ayahNumber: 6,
      arabic: 'أَلَمْ يَجِدْكَ يَتِيمًۭا فَـَٔاوَىٰ',
      banglaPronunciation: 'আলাম ইয়াজিদকা ইয়াতীমান ফা-আওয়া',
      banglaMeaning: 'তিনি কি আপনাকে এতীমরূপে পাননি? অতঃপর তিনি আশ্রয় দিয়েছেন।',
    },
    {
      ayahNumber: 7,
      arabic: 'وَوَجَدَكَ ضَآلًّۭا فَهَدَىٰ',
      banglaPronunciation: 'ওয়া ওয়াজাদাকা দ-ল্লান ফাহাদা',
      banglaMeaning: 'তিনি আপনাকে পেয়েছেন পথহারা, অতঃপর পথপ্রদর্শন করেছেন।',
    },
    {
      ayahNumber: 8,
      arabic: 'وَوَجَدَكَ عَآئِلًۭا فَأَغْنَىٰ',
      banglaPronunciation: 'ওয়া ওয়াজাদাকা আ-ইলান ফা-আগনা',
      banglaMeaning: 'তিনি আপনাকে পেয়েছেন নিঃস্ব, অতঃপর অভাবমুক্ত করেছেন।',
    },
    {
      ayahNumber: 9,
      arabic: 'فَأَمَّا ٱلْيَتِيمَ فَلَا تَقْهَرْ',
      banglaPronunciation: 'ফা-আম্মাল ইয়াতীমা ফালা- তাক্বহার',
      banglaMeaning: 'সুতরাং আপনি এতীমের প্রতি কঠোর হবেন না;',
    },
    {
      ayahNumber: 10,
      arabic: 'وَأَمَّا ٱلسَّآئِلَ فَلَا تَنْهَرْ',
      banglaPronunciation: 'ওয়া আম্মাস সা-ইলা ফালা- তানহার',
      banglaMeaning: 'সওয়ালকারীকে ধমক দেবেন না।',
    },
    {
      ayahNumber: 11,
      arabic: 'وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ',
      banglaPronunciation: 'ওয়া আম্মা- বিনি’মাতি রাব্বিকা ফাহাদ্দিস',
      banglaMeaning: 'এবং আপনার পালনকর্তার নেয়ামতের কথা প্রকাশ করুন।',
    },
  ],
};

const ASH_SHARH: QuranSurahPart = {
  surahNumber: 94,
  surahName: 'Surah Ash-Sharh',
  arabicTitle: 'سُورَةُ الشَّرۡحِ',
  banglaName: 'সূরা আশ-শারহ (৮ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/94.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ',
      banglaPronunciation: 'আলাম নাশরাহ লাকা সাদরাক',
      banglaMeaning: 'আমি কি আপনার বক্ষ উম্মুক্ত করে দেইনি?',
    },
    {
      ayahNumber: 2,
      arabic: 'وَوَضَعْنَا عَنكَ وِزْرَكَ',
      banglaPronunciation: 'ওয়া ওয়াদা’না- আনকা উইযরাক',
      banglaMeaning: 'আমি লাঘব করেছি আপনার বোঝা,',
    },
    {
      ayahNumber: 3,
      arabic: 'ٱلَّذِىٓ أَنقَضَ ظَهْرَكَ',
      banglaPronunciation: 'আল্লাযী আনক্বাদা জাহরাক',
      banglaMeaning: 'যা ছিল আপনার জন্যে অতিশয় দুঃসহ।',
    },
    {
      ayahNumber: 4,
      arabic: 'وَرَفَعْنَا لَكَ ذِكْرَكَ',
      banglaPronunciation: 'ওয়া রাফা’না- লাকা যিকরাক',
      banglaMeaning: 'আমি আপনার আলোচনাকে সমুচ্চ করেছি।',
    },
    {
      ayahNumber: 5,
      arabic: 'فَإِنَّ مَعَ ٱلْعُسْرِ يُسْرًا',
      banglaPronunciation: 'ফা-ইন্না মা’আল উসরি ইউসরা',
      banglaMeaning: 'নিশ্চয় কষ্টের সাথে স্বস্তি রয়েছে।',
    },
    {
      ayahNumber: 6,
      arabic: 'إِنَّ مَعَ ٱلْعُسْرِ يُسْرًۭا',
      banglaPronunciation: 'ইন্না মা’আল উসরি ইউসরা',
      banglaMeaning: 'নিশ্চয় কষ্টের সাথে স্বস্তি রয়েছে।',
    },
    {
      ayahNumber: 7,
      arabic: 'فَإِذَا فَرَغْتَ فَٱنصَبْ',
      banglaPronunciation: 'ফা-ইযা- ফারাগতা ফানসাব',
      banglaMeaning: 'অতএব, যখন অবসর পান পরিশ্রম করুন।',
    },
    {
      ayahNumber: 8,
      arabic: 'وَإِلَىٰ رَبِّكَ فَٱرْغَب',
      banglaPronunciation: 'ওয়া ইলা- রাব্বিকা ফারগাব',
      banglaMeaning: 'এবং আপনার পালনকর্তার প্রতি মনোনিবেশ করুন।',
    },
  ],
};

const AT_TIN: QuranSurahPart = {
  surahNumber: 95,
  surahName: 'Surah At-Tin',
  arabicTitle: 'سُورَةُ التِّينِ',
  banglaName: 'সূরা আত-তীন (৮ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/95.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'وَٱلتِّينِ وَٱلزَّيْتُونِ',
      banglaPronunciation: 'ওয়াত-তীনি ওয়ায-যাইতূন',
      banglaMeaning: 'শপথ আঞ্জীর (ডুমুর) ও যয়তুনের,',
    },
    {
      ayahNumber: 2,
      arabic: 'وَطُورِ سِينِينَ',
      banglaPronunciation: 'ওয়া তূরি সীনীন',
      banglaMeaning: 'এবং সিনাই প্রান্তরস্থ তূর পর্বতের,',
    },
    {
      ayahNumber: 3,
      arabic: 'وَهَٰذَا ٱلْبَلَدِ ٱلْأَمِينِ',
      banglaPronunciation: 'ওয়া হা-যাল বালাদিল আমীন',
      banglaMeaning: 'এবং এই নিরাপদ নগরীর।',
    },
    {
      ayahNumber: 4,
      arabic: 'لَقَدْ خَلَقْنَا ٱلْإِنسَٰنَ فِىٓ أَحْسَنِ تَقْوِيمٍۢ',
      banglaPronunciation: 'লাক্বাদ খালাক্বনাল ইনসা-না ফী আহসানি তাক্বওয়ীম',
      banglaMeaning: 'আমি সৃষ্টি করেছি মানুষকে সুন্দরতর অবয়বে।',
    },
    {
      ayahNumber: 5,
      arabic: 'ثُمَّ رَدَدْنَٰهُ أَسْفَلَ سَٰفِلِينَ',
      banglaPronunciation: 'ছুম্মা রাদাদনা-হু আসফালা সা-ফিলীন',
      banglaMeaning: 'অতঃপর তাকে ফিরিয়ে দিয়েছি নীচ থেকে নীচে।',
    },
    {
      ayahNumber: 6,
      arabic: 'إِلَّا ٱلَّذِينَ ءَامَنُوا۟ وَعَمِلُوا۟ ٱلصَّٰلِحَٰتِ فَلَهُمْ أَجْرٌ غَيْرُ مَمْنُونٍۢ',
      banglaPronunciation: 'ইল্লাল্লাযীনা আ-মানূ ওয়া আমিলুস সা-লিহা-তি ফালাহুম আজরুন গাইরু মামনূন',
      banglaMeaning: 'কিন্তু যারা বিশ্বাস স্থাপন করেছে ও সৎকর্ম করেছে, তাদের জন্যে রয়েছে অশেষ পুরস্কার।',
    },
    {
      ayahNumber: 7,
      arabic: 'فَمَا يُكَذِّبُكَ بَعْدُ بِٱلدِّينِ',
      banglaPronunciation: 'ফামা- ইউকাযযিবুকা বা’দু বিদ্দীন',
      banglaMeaning: 'অতঃপর কেন তুমি অবিশ্বাস করছ কেয়ামতকে?',
    },
    {
      ayahNumber: 8,
      arabic: 'أَلَيْسَ ٱللَّهُ بِأَحْكَمِ ٱلْحَٰكِمِينَ',
      banglaPronunciation: 'আলাইসাল্লা-হু বি-আহকামিল হা-কিমীন',
      banglaMeaning: 'আল্লাহ কি বিচারকদের মধ্যে শ্রেষ্ঠতম বিচারক নন?',
    },
  ],
};

const AL_QADR: QuranSurahPart = {
  surahNumber: 97,
  surahName: 'Surah Al-Qadr',
  arabicTitle: 'سُورَةُ القَدۡرِ',
  banglaName: 'সূরা আল-কদর (৫ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/97.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'إِنَّآ أَنزَلْنَٰهُ فِى لَيْلَةِ ٱلْقَدْرِ',
      banglaPronunciation: 'ইন্না- আনযালনা-হু ফী লাইলাতিল ক্বাদর',
      banglaMeaning: 'আমি একে নাযিল করেছি শবে-কদরে।',
    },
    {
      ayahNumber: 2,
      arabic: 'وَمَآ أَدْرَىٰكَ مَا لَيْلَةُ ٱلْقَدْرِ',
      banglaPronunciation: 'ওয়া মা- আদরা-কা মা- লাইলাতুল ক্বাদর',
      banglaMeaning: 'শবে-কদর সম্পর্কে আপনি কি জানেন?',
    },
    {
      ayahNumber: 3,
      arabic: 'لَيْلَةُ ٱلْقَدْرِ خَيْرٌۭ مِّنْ أَلْفِ شَهْرٍۢ',
      banglaPronunciation: 'লাইলাতুল ক্বাদরি খাইরুম মিন আলফি শাহর',
      banglaMeaning: 'শবে-কদর হলো এক হাজার মাস অপেক্ষা শ্রেষ্ঠ।',
    },
    {
      ayahNumber: 4,
      arabic: 'تَنَزَّلُ ٱلْمَلَٰٓئِكَةُ وَٱلرُّوحُ فِيهَا بِإِذْنِ رَبِّهِم مِّن كُلِّ أَمْرٍۢ',
      banglaPronunciation: 'তানাযযালুল মালা-ইকাতু ওয়ার রূহু ফীহা- বি-ইযনি রাব্বিহিম মিন কুল্লি আমর',
      banglaMeaning: 'এতে প্রত্যেক কাজের জন্যে ফেরেশতাগণ ও রূহ অবতীর্ণ হয় তাদের পালনকর্তার নির্দেশক্রমে।',
    },
    {
      ayahNumber: 5,
      arabic: 'سَلَٰمٌ هِىَ حَتَّىٰ مَطْلَعِ ٱلْفَجْرِ',
      banglaPronunciation: 'সালা-মুন হিয়া হাত্তা- মাতলা’ইল ফাজর',
      banglaMeaning: 'এটা নিরাপত্তা, যা ফজরের উদয় পর্যন্ত অব্যাহত থাকে।',
    },
  ],
};

const AL_KAWTHAR: QuranSurahPart = {
  surahNumber: 108,
  surahName: 'Surah Al-Kawthar',
  arabicTitle: 'سُورَةُ الكَوۡثَرِ',
  banglaName: 'সূরা আল-কাওসার (৩ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/108.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'إِنَّآ أَعْطَيْنَٰكَ ٱلْكَوْثَرَ',
      banglaPronunciation: 'ইন্না- আ’তাইনা-কাল কাওছার',
      banglaMeaning: 'নিশ্চয় আমি আপনাকে কাওসার দান করেছি।',
    },
    {
      ayahNumber: 2,
      arabic: 'فَصَلِّ لِرَبِّكَ وَٱنْحَرْ',
      banglaPronunciation: 'ফাসাল্লি লিরাব্বিকা ওয়ানহার',
      banglaMeaning: 'অতএব আপনার পালনকর্তার উদ্দেশ্যে নামায পড়ুন এবং কোরবানী করুন।',
    },
    {
      ayahNumber: 3,
      arabic: 'إِنَّ شَانِئَكَ هُوَ ٱلْأَبْتَرُ',
      banglaPronunciation: 'ইন্না শা-নিআকা হুওয়াল আবতার',
      banglaMeaning: 'যে আপনার শত্রু, সেই তো লেজকাটা, নির্বংশ।',
    },
  ],
};

const AL_IKHLAS: QuranSurahPart = {
  surahNumber: 112,
  surahName: 'Surah Al-Ikhlas',
  arabicTitle: 'سُورَةُ الإِخۡلَاصِ',
  banglaName: 'সূরা আল-ইখলাস (৪ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/112.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'قُلْ هُوَ ٱللَّهُ أَحَدٌ',
      banglaPronunciation: 'ক্বুল হুওয়াল্লা-হু আহাদ',
      banglaMeaning: 'বলুন, তিনি আল্লাহ, এক,',
    },
    {
      ayahNumber: 2,
      arabic: 'ٱللَّهُ ٱلصَّمَدُ',
      banglaPronunciation: 'আল্লা-হুস সামাদ',
      banglaMeaning: 'আল্লাহ অমুখাপেক্ষী,',
    },
    {
      ayahNumber: 3,
      arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
      banglaPronunciation: 'লাম ইয়ালিদ ওয়া লাম ইউলাদ',
      banglaMeaning: 'তিনি কাউকে জন্ম দেননি এবং কেউ তাকে জন্ম দেয়নি',
    },
    {
      ayahNumber: 4,
      arabic: 'وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ',
      banglaPronunciation: 'ওয়া লাম ইয়াকুল লাহূ কুফুওয়ান আহাদ',
      banglaMeaning: 'এবং তাঁর সমতুল্য কেউ নেই।',
    },
  ],
};

const AL_FALAQ: QuranSurahPart = {
  surahNumber: 113,
  surahName: 'Surah Al-Falaq',
  arabicTitle: 'سُورَةُ الفَلَقِ',
  banglaName: 'সূরা আল-ফালাক (৫ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/113.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ',
      banglaPronunciation: 'ক্বুল আ’উযু বিরাব্বিল ফালাক্ব',
      banglaMeaning: 'বলুন, আমি আশ্রয় গ্রহণ করছি প্রভাতের পালনকর্তার,',
    },
    {
      ayahNumber: 2,
      arabic: 'مِن شَرِّ مَا خَلَقَ',
      banglaPronunciation: 'মিন শাররি মা- খালাক্ব',
      banglaMeaning: 'তিনি যা সৃষ্টি করেছেন, তার অনিষ্ট থেকে,',
    },
    {
      ayahNumber: 3,
      arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
      banglaPronunciation: 'ওয়া মিন শাররি গা-সিক্বিন ইযা- ওয়াক্বাব',
      banglaMeaning: 'অন্ধকার রাত্রির অনিষ্ট থেকে, যখন তা সমাগত হয়,',
    },
    {
      ayahNumber: 4,
      arabic: 'وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ',
      banglaPronunciation: 'ওয়া মিন শাররিন নাফফা-ছা-তি ফিল উক্বাদ',
      banglaMeaning: 'গ্রন্থিতে ফুঁৎকার দিয়ে জাদুকারিনীদের অনিষ্ট থেকে',
    },
    {
      ayahNumber: 5,
      arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
      banglaPronunciation: 'ওয়া মিন শাররি হা-সিদিন ইযা- হাসাদ',
      banglaMeaning: 'এবং হিংসুকের অনিষ্ট থেকে যখন সে হিংসা করে।',
    },
  ],
};

const AN_NAS: QuranSurahPart = {
  surahNumber: 114,
  surahName: 'Surah An-Nas',
  arabicTitle: 'سُورَةُ النَّاسِ',
  banglaName: 'সূরা আন-নাস (৬ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/114.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ',
      banglaPronunciation: 'ক্বুল আ’উযু বিরাব্বিন না-স',
      banglaMeaning: 'বলুন, আমি আশ্রয় গ্রহণ করছি মানুষের পালনকর্তার,',
    },
    {
      ayahNumber: 2,
      arabic: 'مَلِكِ ٱلنَّاسِ',
      banglaPronunciation: 'মালিকিন না-স',
      banglaMeaning: 'মানুষের অধিপতির,',
    },
    {
      ayahNumber: 3,
      arabic: 'إِلَٰهِ ٱلنَّاسِ',
      banglaPronunciation: 'ইলা-হিন না-স',
      banglaMeaning: 'মানুষের মা’বুদের,',
    },
    {
      ayahNumber: 4,
      arabic: 'مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ',
      banglaPronunciation: 'মিন শাররিল ওয়াসওয়া-সিল খান্না-স',
      banglaMeaning: 'তার অনিষ্ট থেকে, যে কুমন্ত্রণা দেয় ও আত্মগোপন করে,',
    },
    {
      ayahNumber: 5,
      arabic: 'ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ',
      banglaPronunciation: 'আল্লাযী ইউওয়াসউইসু ফী সুদূরিন না-স',
      banglaMeaning: 'যে কুমন্ত্রণা দেয় মানুষের অন্তরে,',
    },
    {
      ayahNumber: 6,
      arabic: 'مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ',
      banglaPronunciation: 'মিনাল জিন্নাতি ওয়ান-না-স',
      banglaMeaning: 'জ্বিনের মধ্য থেকে অথবা মানুষের মধ্য থেকে।',
    },
  ],
};

const AL_FIL: QuranSurahPart = {
  surahNumber: 105,
  surahName: 'Surah Al-Fil',
  arabicTitle: 'سُورَةُ الفِيلِ',
  banglaName: 'সূরা আল-ফীল (৫ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/105.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَٰبِ ٱلْفِيلِ',
      banglaPronunciation: 'আলাম তারা কাইফা ফা’আলা রাব্বুকা বি-আসহা-বিল ফীল',
      banglaMeaning: 'আপনি কি দেখেননি আপনার পালনকর্তা হস্তীবাহিনীর সাথে কিরূপ ব্যবহার করেছেন?',
    },
    {
      ayahNumber: 2,
      arabic: 'أَلَمْ يَجْعَلْ كَيْدَهُمْ فِى تَضْلِيلٍۢ',
      banglaPronunciation: 'আলাম ইয়াজ’আল কাইদাহুম ফী তাদলীল',
      banglaMeaning: 'তিনি কি তাদের চক্রান্ত নস্যাৎ করে দেননি?',
    },
    {
      ayahNumber: 3,
      arabic: 'وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ',
      banglaPronunciation: 'ওয়া আরসালা আলাইহিম তাইরান আবা-বীল',
      banglaMeaning: 'তিনি তাদের উপর প্রেরণ করেছেন ঝাঁকে ঝাঁকে পাখী,',
    },
    {
      ayahNumber: 4,
      arabic: 'تَرْمِيهِم بِحِجَارَةٍۢ مِّن سِجِّيلٍۢ',
      banglaPronunciation: 'তারমীহিম বিহিজা-রাতিম মিন সিজ্জীল',
      banglaMeaning: 'যারা তাদের উপর পাথরের কংকর নিক্ষেপ করছিল।',
    },
    {
      ayahNumber: 5,
      arabic: 'فَجَعَلَهُمْ كَعَصْفٍۢ مَّأْكُولٍۭ',
      banglaPronunciation: 'ফাজা’আলাহুম কা’আসফিম মা’কূল',
      banglaMeaning: 'অতঃপর তিনি তাদেরকে ভক্ষিত তৃণসদৃশ করে দেন।',
    },
  ],
};

const QURAYSH: QuranSurahPart = {
  surahNumber: 106,
  surahName: 'Surah Quraysh',
  arabicTitle: 'سُورَةُ قُرَيۡشٍ',
  banglaName: 'সূরা কুরাইশ (৪ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/106.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'لِإِيلَٰفِ قُرَيْشٍ',
      banglaPronunciation: 'লি-ঈলা-ফি কুরাইশ',
      banglaMeaning: 'কোরাইশের আসক্তির কারণে,',
    },
    {
      ayahNumber: 2,
      arabic: 'إِۦلَٰفِهِمْ رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ',
      banglaPronunciation: 'ঈলা-ফিহিম রিহলাতাশ-শিতা-ই ওয়াস-সাইফ',
      banglaMeaning: 'আসক্তির কারণে তাদের শীত ও গ্রীষ্মকালীন সফরের।',
    },
    {
      ayahNumber: 3,
      arabic: 'فَلْيَعْبُدُوا۟ رَبَّ هَٰذَا ٱلْبَيْتِ',
      banglaPronunciation: 'ফাল-ইয়া’বুদূ রাব্বা হা-যাল বাইত',
      banglaMeaning: 'অতএব তারা যেন এবাদত করে এই ঘরের পালনকর্তার,',
    },
    {
      ayahNumber: 4,
      arabic: 'ٱلَّذِىٓ أَطْعَمَهُم مِّن جُوعٍۢ وَءَامَنَهُم مِّنْ خَوْفٍۭ',
      banglaPronunciation: 'আল্লাযী আত’আমাহুম মিন জূ’ইও ওয়া আ-মানাহুম মিন খাওফ',
      banglaMeaning: 'যিনি তাদেরকে ক্ষুধায় আহার দিয়েছেন এবং যুদ্ধভীতি থেকে তাদেরকে নিরাপদ করেছেন।',
    },
  ],
};

const AL_ALA: QuranSurahPart = {
  surahNumber: 87,
  surahName: 'Surah Al-A’la',
  arabicTitle: 'سُورَةُ الأَعۡلَىٰ',
  banglaName: 'সূরা আল-আ’লা (১৯ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/87.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'سَبِّحِ ٱسْمَ رَبِّكَ ٱلْأَعْلَى',
      banglaPronunciation: 'সাব্বিহিসমা রাব্বিকাল আ’লা',
      banglaMeaning: 'আপনি আপনার মহান পালনকর্তার নামের পবিত্রতা বর্ণনা করুন,',
    },
    {
      ayahNumber: 2,
      arabic: 'ٱلَّذِى خَلَقَ فَسَوَّىٰ',
      banglaPronunciation: 'আল্লাযী খালাক্বা ফাসাওওয়া',
      banglaMeaning: 'যিনি সৃষ্টি করেছেন ও সুবিন্যস্ত করেছেন।',
    },
    {
      ayahNumber: 3,
      arabic: 'وَٱلَّذِى قَدَّرَ فَهَدَىٰ',
      banglaPronunciation: 'ওয়াল্লাযী ক্বাদ্দারা ফাহাদা',
      banglaMeaning: 'এবং যিনি সুপরিমিত করেছেন ও পথ প্রদর্শন করেছেন,',
    },
    {
      ayahNumber: 4,
      arabic: 'وَٱلَّذِىٓ أَخْرَجَ ٱلْمَرْعَىٰ',
      banglaPronunciation: 'ওয়াল্লাযী আখরাজাল মার’আ',
      banglaMeaning: 'এবং যিনি তৃণাদি উৎপন্ন করেছেন,',
    },
    {
      ayahNumber: 5,
      arabic: 'فَجَعَلَهُۥ غُثَآءً أَحْوَىٰ',
      banglaPronunciation: 'ফাজা’আলাহূ গুছা-আন আহওয়া',
      banglaMeaning: 'অতঃপর করেছেন তাকে কাল আবর্জনা।',
    },
    {
      ayahNumber: 6,
      arabic: 'سَنُقْرِئُكَ فَلَا تَنسَىٰٓ',
      banglaPronunciation: 'সানুক্বরিউকা ফালা- তানসা',
      banglaMeaning: 'আমি আপনাকে পাঠ করাতে থাকব, ফলে আপনি বিস্মৃত হবেন না,',
    },
    {
      ayahNumber: 7,
      arabic: 'إِلَّا مَا شَآءَ ٱللَّهُ ۚ إِنَّهُۥ يَعْلَمُ ٱلْجَهْرَ وَمَا يَخْفَىٰ',
      banglaPronunciation: 'ইল্লা- মা- শা-আল্লা-হ, ইন্নাহূ ইয়া’লামুল জাহরা ওয়া মা- ইয়াখফা',
      banglaMeaning: 'আল্লাহ যা ইচ্ছা করেন তা ব্যতীত। নিশ্চয় তিনি জানেন প্রকাশ্য ও গোপন বিষয়।',
    },
    {
      ayahNumber: 8,
      arabic: 'وَنُيَسِّرُكَ لِلْيُسْرَىٰ',
      banglaPronunciation: 'ওয়া নুইয়াসসিরুকা লিল-ইউসরা',
      banglaMeaning: 'আমি আপনার জন্যে সহজ শরীয়ত সহজতর করে দেবো।',
    },
    {
      ayahNumber: 9,
      arabic: 'فَذَكِّرْ إِن نَّفَعَتِ ٱلذِّكْرَىٰ',
      banglaPronunciation: 'ফাযাক্কির ইন নাফা’আতিয-যিকরা',
      banglaMeaning: 'উপদেশ ফলপ্রসূ হলে উপদেশ দান করুন,',
    },
    {
      ayahNumber: 10,
      arabic: 'سَيَذَّكَّرُ مَن يَخْشَىٰ',
      banglaPronunciation: 'সাইয়াযযাক্কারু মাই-ইয়াখশা',
      banglaMeaning: 'যে ভয় করে, সে উপদেশ গ্রহণ করবে,',
    },
    {
      ayahNumber: 11,
      arabic: 'وَيَتَجَنَّبُهَا ٱلْأَشْقَى',
      banglaPronunciation: 'ওয়া ইয়াতাজান্নাবুহাল আশক্বা',
      banglaMeaning: 'আর যে হতভাগা, সে তা উপেক্ষা করবে,',
    },
    {
      ayahNumber: 12,
      arabic: 'ٱلَّذِى يَصْلَى ٱلنَّارَ ٱلْكُبْرَىٰ',
      banglaPronunciation: 'আল্লাযী ইয়াসলান-না-রাল কুবরা',
      banglaMeaning: 'সে মহা-অগ্নিতে প্রবেশ করবে।',
    },
    {
      ayahNumber: 13,
      arabic: 'ثُمَّ لَا يَمُوتُ فِيهَا وَلَا يَحْيَىٰ',
      banglaPronunciation: 'ছুম্মা লা- ইয়ামূতু ফীহা- ওয়া লা- ইয়াহইয়া',
      banglaMeaning: 'অতঃপর সেখানে সে মরবেও না, জীবিতও থাকবে না।',
    },
    {
      ayahNumber: 14,
      arabic: 'قَدْ أَفْلَحَ مَن تَزَكَّىٰ',
      banglaPronunciation: 'ক্বাদ আফলাহা মান তাযাক্কা',
      banglaMeaning: 'নিশ্চয় সাফল্য লাভ করবে সে, যে শুদ্ধ হয়,',
    },
    {
      ayahNumber: 15,
      arabic: 'وَذَكَرَ ٱسْمَ رَبِّهِۦ فَصَلَّىٰ',
      banglaPronunciation: 'ওয়া যাকারাসমা রাব্বিহী ফাসাল্লা',
      banglaMeaning: 'এবং তার পালনকর্তার নাম স্মরণ করে, অতঃপর নামায আদায় করে।',
    },
    {
      ayahNumber: 16,
      arabic: 'بَلْ تُؤْثِرُونَ ٱلْحَيَوٰةَ ٱلدُّنْيَا',
      banglaPronunciation: 'বাল তু’ছিরূনাল হায়া-তাদ দুনইয়া',
      banglaMeaning: 'বস্তুতঃ তোমরা পার্থিব জীবনকে অগ্রাধিকার দাও,',
    },
    {
      ayahNumber: 17,
      arabic: 'وَٱلْءَاخِرَةُ خَيْرٌۭ وَأَبْقَىٰٓ',
      banglaPronunciation: 'ওয়াল-আ-খিরাতু খাইরুও ওয়া আবক্বা',
      banglaMeaning: 'অথচ পরকালের জীবন উৎকৃষ্ট ও স্থায়ী।',
    },
    {
      ayahNumber: 18,
      arabic: 'إِنَّ هَٰذَا لَفِى ٱلصُّحُفِ ٱلْأُولَىٰ',
      banglaPronunciation: 'ইন্না হা-যা- লাফিস সুহুফিল ঊলা',
      banglaMeaning: 'এটা লিখিত রয়েছে পূর্ববর্তী কিতাবসমূহে;',
    },
    {
      ayahNumber: 19,
      arabic: 'صُحُفِ إِبْرَٰهِيمَ وَمُوسَىٰ',
      banglaPronunciation: 'সুহুফি ইবরা-হীমা ওয়া মূসা',
      banglaMeaning: 'ইব্রাহীম ও মূসার কিতাবসমূহে।',
    },
  ],
};

const ASH_SHAMS: QuranSurahPart = {
  surahNumber: 91,
  surahName: 'Surah Ash-Shams',
  arabicTitle: 'سُورَةُ الشَّمۡسِ',
  banglaName: 'সূরা আশ-শামস (১৫ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/91.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'وَٱلشَّمْسِ وَضُحَىٰهَا',
      banglaPronunciation: 'ওয়াশ-শামসি ওয়া দুহা-হা',
      banglaMeaning: 'শপথ সূর্যের ও তার কিরণের,',
    },
    {
      ayahNumber: 2,
      arabic: 'وَٱلْقَمَرِ إِذَا تَلَىٰهَا',
      banglaPronunciation: 'ওয়াল-ক্বামারি ইযা- তালা-হা',
      banglaMeaning: 'শপথ চন্দ্রের যখন তা সূর্যের পশ্চাতে আসে,',
    },
    {
      ayahNumber: 3,
      arabic: 'وَٱلنَّهَارِ إِذَا جَلَّىٰهَا',
      banglaPronunciation: 'ওয়ান-নাহা-রি ইযা- জাল্লা-হা',
      banglaMeaning: 'শপথ দিবসের যখন সে সূর্যকে প্রখরভাবে প্রকাশ করে,',
    },
    {
      ayahNumber: 4,
      arabic: 'وَٱلَّيْلِ إِذَا يَغْشَىٰهَا',
      banglaPronunciation: 'ওয়াল-লাইলি ইযা- ইয়াগশা-হা',
      banglaMeaning: 'শপথ রাত্রির যখন সে সূর্যকে আচ্ছাদিত করে,',
    },
    {
      ayahNumber: 5,
      arabic: 'وَٱلسَّمَآءِ وَمَا بَنَىٰهَا',
      banglaPronunciation: 'ওয়াস-সামা-ই ওয়া মা- বানা-হা',
      banglaMeaning: 'শপথ আকাশের এবং যিনি তা নির্মাণ করেছেন, তাঁর।',
    },
    {
      ayahNumber: 6,
      arabic: 'وَٱلْأَرْضِ وَمَا طَحَىٰهَا',
      banglaPronunciation: 'ওয়াল-আরদি ওয়া মা- তাহা-হা',
      banglaMeaning: 'শপথ পৃথিবীর এবং যিনি তা বিস্তৃত করেছেন, তাঁর,',
    },
    {
      ayahNumber: 7,
      arabic: 'وَنَفْسٍۢ وَمَا سَوَّىٰهَا',
      banglaPronunciation: 'ওয়া নাফসিও ওয়া মা- সাওওয়া-হা',
      banglaMeaning: 'শপথ প্রাণের এবং যিনি তা সুবিন্যস্ত করেছেন, তাঁর,',
    },
    {
      ayahNumber: 8,
      arabic: 'فَأَلْهَمَهَا فُجُورَهَا وَتَقْوَىٰهَا',
      banglaPronunciation: 'ফা-আলহামাহা- ফুজূরাহা- ওয়া তাক্বওয়া-হা',
      banglaMeaning: 'অতঃপর তাকে তার অসৎকর্ম ও সৎকর্মের জ্ঞান দান করেছেন,',
    },
    {
      ayahNumber: 9,
      arabic: 'قَدْ أَفْلَحَ مَن زَكَّىٰهَا',
      banglaPronunciation: 'ক্বাদ আফলাহা মান যাক্কা-হা',
      banglaMeaning: 'যে নিজেকে শুদ্ধ করে, সেই সফলকাম হয়।',
    },
    {
      ayahNumber: 10,
      arabic: 'وَقَدْ خَابَ مَن دَسَّىٰهَا',
      banglaPronunciation: 'ওয়া ক্বাদ খা-বা মান দাসসা-হা',
      banglaMeaning: 'এবং যে নিজেকে কলুষিত করে, সে ব্যর্থ মনোরথ হয়।',
    },
    {
      ayahNumber: 11,
      arabic: 'كَذَّبَتْ ثَمُودُ بِطَغْوَىٰهَآ',
      banglaPronunciation: 'কাযযাবাত ছামূদু বিতাগওয়া-হা',
      banglaMeaning: 'সামুদ সম্প্রদায় অবাধ্যতা বশতঃ মিথ্যারোপ করেছিল।',
    },
    {
      ayahNumber: 12,
      arabic: 'إِذِ ٱنۢبَعَثَ أَشْقَىٰهَا',
      banglaPronunciation: 'ইযিমবা’আছা আশক্বা-হা',
      banglaMeaning: 'যখন তাদের সর্বাধিক হতভাগ্য ব্যক্তি তৎপর হয়ে উঠেছিল।',
    },
    {
      ayahNumber: 13,
      arabic: 'فَقَالَ لَهُمْ رَسُولُ ٱللَّهِ نَاقَةَ ٱللَّهِ وَسُقْيَٰهَا',
      banglaPronunciation: 'ফাক্বা-লা লাহুম রাসূলুল্লা-হি না-ক্বাতাল্লা-হি ওয়া সুক্বইয়া-হা',
      banglaMeaning: 'অতঃপর আল্লাহর রসূল তাদেরকে বলেছিলেন: আল্লাহর উষ্ট্রী ও তাকে পানি পান করানোর ব্যাপারে সতর্ক থাক।',
    },
    {
      ayahNumber: 14,
      arabic: 'فَكَذَّبُوهُ فَعَقَرُوهَا فَدَمْدَمَ عَلَيْهِمْ رَبُّهُم بِذَنۢبِهِمْ فَسَوَّىٰهَا',
      banglaPronunciation: 'ফাকাযযাবূহু ফা-আক্বারূহা- ফাদামদামা আলাইহিম রাব্বুহুম বিযামবিহিম ফাসাওওয়া-হা',
      banglaMeaning: 'অতঃপর ওরা তার প্রতি মিথ্যারোপ করেছিল এবং উষ্ট্রীর পা কর্তন করেছিল। তাদের পাপের কারণে তাদের পালনকর্তা তাদের উপর ধ্বংস নাযিল করে একাকার করে দিলেন।',
    },
    {
      ayahNumber: 15,
      arabic: 'وَلَا يَخَافُ عُقْبَٰهَا',
      banglaPronunciation: 'ওয়া লা- ইয়াখা-ফু উক্ববা-হা',
      banglaMeaning: 'আল্লাহ তা’আলা এই ধ্বংসের কোন বিরূপ পরিণতির আশংকা করেন না।',
    },
  ],
};

const AL_GHASHIYAH: QuranSurahPart = {
  surahNumber: 88,
  surahName: 'Surah Al-Ghashiyah',
  arabicTitle: 'سُورَةُ الغَاشِيَةِ',
  banglaName: 'সূরা আল-গাশিয়াহ (২৬ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/88.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'هَلْ أَتَىٰكَ حَدِيثُ ٱلْغَٰشِيَةِ',
      banglaPronunciation: 'হাল আতা-কা হাদীছুল গা-শিয়াহ',
      banglaMeaning: 'আপনার কাছে আচ্ছন্নকারী কেয়ামতের বৃত্তান্ত পৌঁছেছে কি?',
    },
    {
      ayahNumber: 2,
      arabic: 'وُجُوهٌۭ يَوْمَئِذٍ خَٰشِعَةٌ',
      banglaPronunciation: 'উজূহুইঁ-ইয়াওমা-ইযিন খা-শি’আহ',
      banglaMeaning: 'অনেক মুখমন্ডল সেদিন হবে লাঞ্ছিত,',
    },
    {
      ayahNumber: 3,
      arabic: 'عَامِلَةٌۭ نَّاصِبَةٌۭ',
      banglaPronunciation: 'আ-মিলাতুন না-সিবাহ',
      banglaMeaning: 'ক্লিষ্ট, ক্লান্ত।',
    },
    {
      ayahNumber: 4,
      arabic: 'تَصْلَىٰ نَارًا حَامِيَةًۭ',
      banglaPronunciation: 'তাসলা- না-রান হা-মিয়াহ',
      banglaMeaning: 'তারা জ্বলন্ত আগুনে পতিত হবে।',
    },
    {
      ayahNumber: 5,
      arabic: 'تُسْقَىٰ مِنْ عَيْنٍ ءَانِيَةٍۢ',
      banglaPronunciation: 'তুসক্বা- মিন আইনিন আ-নিয়াহ',
      banglaMeaning: 'তাদেরকে ফুটন্ত নহর থেকে পান করানো হবে।',
    },
    {
      ayahNumber: 6,
      arabic: 'لَّيْسَ لَهُمْ طَعَامٌ إِلَّا مِن ضَرِيعٍۢ',
      banglaPronunciation: 'লাইসা লাহুম তা’আ-মুন ইল্লা- মিন দারী’',
      banglaMeaning: 'কন্টকপূর্ণ ঝাড় ব্যতীত তাদের জন্যে কোন খাদ্য নেই।',
    },
    {
      ayahNumber: 7,
      arabic: 'لَّا يُسْمِنُ وَلَا يُغْنِى مِن جُوعٍۢ',
      banglaPronunciation: 'লা- ইউসমিনু ওয়া লা- ইউগনী মিন জূ’',
      banglaMeaning: 'এটা তাদেরকে পুষ্ট করবে না এবং ক্ষুধায়ও উপকার করবে না।',
    },
    {
      ayahNumber: 8,
      arabic: 'وُجُوهٌۭ يَوْمَئِذٍۢ نَّاعِمَةٌۭ',
      banglaPronunciation: 'উজূহুইঁ-ইয়াওমা-ইযিন না-’ইমাহ',
      banglaMeaning: 'অনেক মুখমন্ডল সেদিন হবে সজীব,',
    },
    {
      ayahNumber: 9,
      arabic: 'لِّسَعْيِهَا رَاضِيَةٌۭ',
      banglaPronunciation: 'লিসা’য়িহা- রা-দিয়াহ',
      banglaMeaning: 'তাদের কর্মের কারণে সন্তুষ্ট।',
    },
    {
      ayahNumber: 10,
      arabic: 'فِى جَنَّةٍ عَالِيَةٍۢ',
      banglaPronunciation: 'ফী জান্নাতিন আ-লিয়াহ',
      banglaMeaning: 'তারা থাকবে সুউচ্চ জান্নাতে।',
    },
    {
      ayahNumber: 11,
      arabic: 'لَّا تَسْمَعُ فِيهَا لَٰغِيَةًۭ',
      banglaPronunciation: 'লা- তাসমা’উ ফীহা- লা-গিয়াহ',
      banglaMeaning: 'তথায় শুনবে না কোন অসার কথাবার্তা।',
    },
    {
      ayahNumber: 12,
      arabic: 'فِيهَا عَيْنٌۭ جَارِيَةٌۭ',
      banglaPronunciation: 'ফীহা- আইনুন জা-রিয়াহ',
      banglaMeaning: 'তথায় থাকবে প্রবাহিত ঝরণা।',
    },
    {
      ayahNumber: 13,
      arabic: 'فِيهَا سُرُرٌۭ مَّرْفُوعَةٌۭ',
      banglaPronunciation: 'ফীহা- সুরুরুম মারফূ’আহ',
      banglaMeaning: 'তথায় থাকবে উন্নত সুসজ্জিত আসন।',
    },
    {
      ayahNumber: 14,
      arabic: 'وَأَكْوَابٌۭ مَّوْضُوعَةٌۭ',
      banglaPronunciation: 'ওয়া আকওয়া-বুম মাওদূ’আহ',
      banglaMeaning: 'এবং সংরক্ষিত পানপাত্র,',
    },
    {
      ayahNumber: 15,
      arabic: 'وَنَمَارِقُ مَصْفُوفَةٌۭ',
      banglaPronunciation: 'ওয়া নামা-রিক্বু মাসফূফাহ',
      banglaMeaning: 'এবং সারি সারি গালিচা,',
    },
    {
      ayahNumber: 16,
      arabic: 'وَزَرَابِىُّ مَبْثُوثَةٌ',
      banglaPronunciation: 'ওয়া যারা-বিয়্যু মাবছূছাহ',
      banglaMeaning: 'এবং বিস্তৃত বিছানো কার্পেট।',
    },
    {
      ayahNumber: 17,
      arabic: 'أَفَلَا يَنظُرُونَ إِلَى ٱلْإِبِلِ كَيْفَ خُلِقَتْ',
      banglaPronunciation: 'আফালা- ইয়ানজুরূনা ইলাল ইবিলি কাইফা খুলিক্বাত',
      banglaMeaning: 'তারা কি উষ্ট্রের প্রতি লক্ষ্য করে না যে, তা কিভাবে সৃষ্টি করা হয়েছে?',
    },
    {
      ayahNumber: 18,
      arabic: 'وَإِلَى ٱلسَّمَآءِ كَيْفَ رُفِعَتْ',
      banglaPronunciation: 'ওয়া ইলাস-সামা-ই কাইফা রুফি’আত',
      banglaMeaning: 'এবং আকাশের প্রতি লক্ষ্য করে না যে, তা কিভাবে উচ্চ করা হয়েছে?',
    },
    {
      ayahNumber: 19,
      arabic: 'وَإِلَى ٱلْجِبَالِ كَيْفَ نُصِبَتْ',
      banglaPronunciation: 'ওয়া ইলাল জিবা-লি কাইফা নুসিবাত',
      banglaMeaning: 'এবং পাহাড়ের দিকে যে, তা কিভাবে স্থাপন করা হয়েছে?',
    },
    {
      ayahNumber: 20,
      arabic: 'وَإِلَى ٱلْأَرْضِ كَيْفَ سُطِحَتْ',
      banglaPronunciation: 'ওয়া ইলাল আরদি কাইফা সুতিহাত',
      banglaMeaning: 'এবং পৃথিবীর দিকে যে, তা কিভাবে সমতল বিছানো হয়েছে?',
    },
    {
      ayahNumber: 21,
      arabic: 'فَذَكِّرْ إِنَّمَآ أَنتَ مُذَكِّرٌۭ',
      banglaPronunciation: 'ফাযাক্কির ইন্নামা- আনতা মুযাক্কির',
      banglaMeaning: 'অতএব, আপনি উপদেশ দিন, আপনি তো কেবল একজন উপদেশদাতা,',
    },
    {
      ayahNumber: 22,
      arabic: 'لَّسْتَ عَلَيْهِم بِمُصَيْطِرٍ',
      banglaPronunciation: 'লাসতা আলাইহিম বিমুসাইতির',
      banglaMeaning: 'আপনি তাদের শাসক নন,',
    },
    {
      ayahNumber: 23,
      arabic: 'إِلَّا مَن تَوَلَّىٰ وَكَفَرَ',
      banglaPronunciation: 'ইল্লা- মান তাওয়াল্লা- ওয়া কাফার',
      banglaMeaning: 'কিন্তু যে মুখ ফিরিয়ে নেয় ও কাফের হয়ে যায়,',
    },
    {
      ayahNumber: 24,
      arabic: 'فَيُعَذِّبُهُ ٱللَّهُ ٱلْعَذَابَ ٱلْأَكْبَرَ',
      banglaPronunciation: 'ফাইউ’আযযিবুহুল্লা-হুল আযা-বাল আকবার',
      banglaMeaning: 'আল্লাহ তাকে মহা আযাব দেবেন।',
    },
    {
      ayahNumber: 25,
      arabic: 'إِنَّ إِلَيْنَآ إِيَابَهُمْ',
      banglaPronunciation: 'ইন্না ইলাইনা- ইয়া-বাহুম',
      banglaMeaning: 'নিশ্চয় তাদের প্রত্যাবর্তন আমারই নিকট,',
    },
    {
      ayahNumber: 26,
      arabic: 'ثُمَّ إِنَّ عَلَيْنَا حِسَابَهُم',
      banglaPronunciation: 'ছুম্মা ইন্না আলাইনা- হিসা-বাহুম',
      banglaMeaning: 'অতঃপর তাদের হিসাব-নিকাশ আমারই দায়িত্ব।',
    },
  ],
};

const AL_MULK: QuranSurahPart = {
  surahNumber: 67,
  surahName: 'Surah Al-Mulk',
  arabicTitle: 'سُورَةُ المُلۡكِ',
  banglaName: 'সূরা আল-মুলক (৩০ আয়াত)',
  audioUrl: 'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/67.mp3',
  ayahs: [
    {
      ayahNumber: 1,
      arabic: 'تَبَٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَىْءٍۢ قَدِيرٌ',
      banglaPronunciation: 'তাবা-রাকাল্লাযী বি-ইয়াদিহিল মুলকু ওয়া হুওয়া আলা- কুল্লি শাই-ইন ক্বাদীর',
      banglaMeaning: 'পূণ্যময় তিনি, যাঁর হাতে রাজত্ব। তিনি সবকিছুর উপর সর্বশক্তিমান।',
    },
    {
      ayahNumber: 2,
      arabic: 'ٱلَّذِى خَلَقَ ٱلْمَوْتَ وَٱلْحَيَوٰةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًۭا ۚ وَهُوَ ٱلْعَزِيزُ ٱلْغَفُورُ',
      banglaPronunciation: 'আল্লাযী খালাক্বাল মাওতা ওয়াল হায়া-তা লি-ইয়াবলুওয়াকুম আইয়্যুকুম আহসানু আমালা, ওয়া হুওয়াল আযীযুল গাফূর',
      banglaMeaning: 'যিনি সৃষ্টি করেছেন মরণ ও জীবন, যাতে তোমাদেরকে পরীক্ষা করেন-কে তোমাদের মধ্যে কর্মে শ্রেষ্ঠ? তিনি পরাক্রমশালী, ক্ষমাময়।',
    },
    {
      ayahNumber: 3,
      arabic: 'ٱلَّذِى خَلَقَ سَبْعَ سَمَٰوَٰتٍۢ طِبَاقًۭا ۖ مَّا تَرَىٰ فِى خَلَقِ ٱلرَّحْمَٰنِ مِن تَفَٰوُتٍۢ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍۢ'.replace('خَلَقِ', 'خَلْقِ'),
      banglaPronunciation: 'আল্লাযী খালাক্বা সাব’আ সামা-ওয়া-তিন তিবা-ক্বা, মা- তারা- ফী খালক্বির রাহমা-নি মিন তাফা-উত, ফারজি’ইল বাসারা হাল তারা- মিন ফুতূর',
      banglaMeaning: 'তিনি সপ্ত আকাশ স্তরে স্তরে সৃষ্টি করেছেন। তুমি করুণাময় আল্লাহ তা’আলার সৃষ্টিতে কোন তফাত দেখতে পাবে না। আবার দৃষ্টি ফেরাও; কোন ফাটল দেখতে পাও কি?',
    },
    {
      ayahNumber: 4,
      arabic: 'ثُمَّ ٱرْجِعِ ٱلْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ ٱلْبَصَرُ خَاسِئًۭا وَهُوَ حَسِيرٌۭ',
      banglaPronunciation: 'ছুম্মারজি’ইল বাসারা কাররাতাইনি ইয়ানক্বালিব ইলাইকাল বাসারু খা-সিআও ওয়া হুওয়া হাসীর',
      banglaMeaning: 'অতঃপর তুমি বার বার তাকিয়ে দেখ-তোমার দৃষ্টি ব্যর্থ ও পরিশ্রান্ত হয়ে তোমার দিকে ফিরে আসবে।',
    },
    {
      ayahNumber: 5,
      arabic: 'وَلَقَدْ زَيَّنَّا ٱلسَّمَآءَ ٱلدُّنْيَا بِمَصَٰبِيحَ وَجَعَلْنَٰهَا رُجُومًۭا لِّلشَّيَٰطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ ٱلسَّعِيرِ',
      banglaPronunciation: 'ওয়া লাক্বাদ যাইয়্যান্নাস সামা-আদ দুনইয়া- বিমাসা-বীহা ওয়া জা’আলনা-হা- রুজূমাল লিশ-শায়া-তীন, ওয়া আ’তাদনা- লাহুম আযা-বাস সা’ঈর',
      banglaMeaning: 'আমি সর্বনিম্ন আকাশকে প্রদীপমালা দ্বারা সুসজ্জিত করেছি; সেগুলোকে শয়তানদের জন্যে ক্ষেপণাস্ত্রবৎ করেছি এবং প্রস্তুত করে রেখেছি তাদের জন্যে জ্বলন্ত অগ্নির শাস্তি।',
    },
    {
      ayahNumber: 6,
      arabic: 'وَلِلَّذِينَ كَفَرُوا۟ بِرَبِّهِمْ عَذَابُ جَهَنَّمَ ۖ وَبِئْسَ ٱلْمَصِيرُ',
      banglaPronunciation: 'ওয়া লিল্লাযীনা কাফারূ বিরাব্বিহিম আযা-বু জাহান্নাম, ওয়া বি’সাল মাসীর',
      banglaMeaning: 'যারা তাদের পালনকর্তাকে অস্বীকার করেছে তাদের জন্যে রয়েছে জাহান্নামের শাস্তি। সেটা কতই না নিকৃষ্ট স্থান।',
    },
    {
      ayahNumber: 7,
      arabic: 'إِذَآ أُلْقُوا۟ فِيهَا سَمِعُوا۟ لَهَا شَهِيقًۭا وَهِىَ تَفُورُ',
      banglaPronunciation: 'ইযা- উলক্বূ ফীহা- সামি’ঊ লাহা- শাহীক্বাও ওয়া হিয়া তাফূর',
      banglaMeaning: 'যখন তারা তথায় নিক্ষিপ্ত হবে, তখন তার উৎক্ষিপ্ত গর্জন শুনতে পাবে।',
    },
    {
      ayahNumber: 8,
      arabic: 'تَكَادُ تَمَيَّزُ مِنَ ٱلْغَيْظِ ۖ كُلَّمَآ أُلْقِىَ فِيهَا فَوْجٌۭ سَأَلَهُمْ خَزَنَتُهَآ أَلَمْ يَأْتِكُمْ نَذِيرٌۭ',
      banglaPronunciation: 'তাকা-দু তামাইয়্যাযু মিনাল গাইজ, কুল্লামা- উলক্বিয়া ফীহা- ফাওজুন সাআলাহুম খাযানাতুহা- আলাম ইয়া’তিকুম নাযীর',
      banglaMeaning: 'ক্রোধে জাহান্নাম যেন ফেটে পড়বে। যখনই তাতে কোন সম্প্রদায় নিক্ষিপ্ত হবে তখন তাদেরকে তার সিপাহীরা জিজ্ঞাসা করবে: তোমাদের কাছে কি কোন সতর্ককারী আগমন করেনি?',
    },
    {
      ayahNumber: 9,
      arabic: 'قَالُوا۟ بَلَىٰ قَدْ جَآءَنَا نَذِيرٌۭ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ ٱللَّهُ مِن شَىْءٍ إِنْ أَنتُمْ إِلَّا فِى ضَلَٰلٍۢ كَبِيرٍۢ',
      banglaPronunciation: 'ক্বা-লূ বালা- ক্বাদ জা-আনা- নাযীরুন ফাকাযযাবনা- ওয়া ক্বুলনা- মা- নাযযালাল্লা-হু মিন শাই, ইন আনতুম ইল্লা- ফী দালা-লিন কাবীর',
      banglaMeaning: 'তারা বলবে: হ্যাঁ আমাদের কাছে সতর্ককারী আগমন করেছিল, অতঃপর আমরা মিথ্যারোপ করেছিলাম এবং বলেছিলাম: আল্লাহ তা’আলা কোন কিছু নাযিল করেননি। তোমরা মহাবিভ্রান্তিতে পড়ে রয়েছ।',
    },
    {
      ayahNumber: 10,
      arabic: 'وَقَالُوا۟ لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِىٓ أَصْحَٰبِ ٱلسَّعِيرِ',
      banglaPronunciation: 'ওয়া ক্বা-লূ লাও কুন্না- নাসমা’উ আও না’ক্বিলু মা- কুন্না- ফী আসহা-বিস সা’ঈর',
      banglaMeaning: 'তারা আরও বলবে: যদি আমরা শুনতাম অথবা বুদ্ধি খাটাতাম, তবে আমরা জাহান্নামবাসীদের মধ্যে থাকতাম না।',
    },
    {
      ayahNumber: 11,
      arabic: 'فَٱعْتَرَفُوا۟ بِذَنۢبِهِمْ فَسُحْقًۭا لِّأَصْحَٰبِ ٱلسَّعِيرِ',
      banglaPronunciation: 'ফা’তারাফূ বিযামবিহিম ফাসুহক্বাল লি-আসহা-বিস সা’ঈর',
      banglaMeaning: 'অতঃপর তারা তাদের অপরাধ স্বীকার করবে। জাহান্নামীরা দূর হোক।',
    },
    {
      ayahNumber: 12,
      arabic: 'إِنَّ ٱلَّذِينَ يَخْشَوْنَ رَبَّهُم بِٱلْغَيْبِ لَهُم مَّغْفِرَةٌۭ وَأَجْرٌۭ كَبِيرٌۭ',
      banglaPronunciation: 'ইন্নাল্লাযীনা ইয়াখশাওনা রাব্বাহুম বিলগাইবি লাহুম মাগফিরাতুও ওয়া আজরুন কাবীর',
      banglaMeaning: 'নিশ্চয় যারা তাদের পালনকর্তাকে না দেখে ভয় করে, তাদের জন্যে রয়েছে ক্ষমা ও মহাপুরস্কার।',
    },
    {
      ayahNumber: 13,
      arabic: 'وَأَسِرُّوا۟ قَوْلَكُمْ أَوِ ٱجْهَرُوا۟ بِهِۦٓ ۖ إِنَّهُۥ عَلِيمٌۢ بِذَاتِ ٱلصُّدُورِ',
      banglaPronunciation: 'ওয়া আসিররূ ক্বাওলাকুম আওয়িজহারূ বিহী, ইন্নাহূ আলীমুম বিযা-তিস সুদূর',
      banglaMeaning: 'তোমরা তোমাদের কথা গোপনে বল অথবা প্রকাশ্যে বল, তিনি তো অন্তরের বিষয়াদি সম্পর্কে সম্যক অবগত।',
    },
    {
      ayahNumber: 14,
      arabic: 'أَلَا يَعْلَمُ مَنْ خَلَقَ وَهُوَ ٱللَّطِيفُ ٱلْخَبِيرُ',
      banglaPronunciation: 'আলা- ইয়া’লামু মান খালাক্বা ওয়া হুওয়াল লাতীফুল খাবীর',
      banglaMeaning: 'যিনি সৃষ্টি করেছেন, তিনি কি করে জানবেন না? তিনি সূক্ষ্মজ্ঞানী, সম্যক জ্ঞাত।',
    },
    {
      ayahNumber: 15,
      arabic: 'هُوَ ٱلَّذِى جَعَلَ لَكُمُ ٱلْأَرْضَ ذَلُولًۭا فَٱمْشُوا۟ فِى مَنَاكِبِهَا وَكُلُوا۟ مِن رِّزْقِهِۦ ۖ وَإِلَيْهِ ٱلنُّشُورُ',
      banglaPronunciation: 'হুওয়াল্লাযী জা’আলা লাকুমুল আরদা যালূলান ফামশূ ফী মানা-কিবিহা- ওয়া কুলূ মির রিযক্বিহী, ওয়া ইলাইহিন নুশূর',
      banglaMeaning: 'তিনি তোমাদের জন্যে পৃথিবীকে সুগম করেছেন, অতএব, তোমরা তার কাঁধে বিচরণ কর এবং তাঁর দেয়া রিযিক আহার কর। তাঁরই কাছে পুনরুজ্জীবন হবে।',
    },
    {
      ayahNumber: 16,
      arabic: 'ءَأَمِنتُم مَّن فِى ٱلسَّمَآءِ أَن يَخْسِفَ بِكُمُ ٱلْأَرْضَ فَإِذَا هِىَ تَمُورُ',
      banglaPronunciation: 'আ-আমিনতুম মান ফিস-সামা-ই আইঁ-ইয়াখসিফা বিকুমুল আরদা ফাইযা- হিয়া তামূর',
      banglaMeaning: 'তোমরা কি ভাবনামুক্ত হয়ে গেছ যে, আকাশে যিনি আছেন তিনি তোমাদেরকে ভূগর্ভে বিলীন করে দেবেন, অতঃপর তা কাঁপতে থাকবে।',
    },
    {
      ayahNumber: 17,
      arabic: 'أَمْ أَمِنتُم مَّن فِى ٱلسَّمَآءِ أَن يُرْسِلَ عَلَيْكُمْ حَاصِبًۭا ۖ فَسَتَعْلَمُونَ كَيْفَ نَذِيرِ',
      banglaPronunciation: 'আম আমিনতুম মান ফিস-সামা-ই আইঁ-ইউরসিলা আলাইকুম হা-সিবা, ফাসাতা’লামূনা কাইফা নাযীর',
      banglaMeaning: 'না তোমরা নিশ্চিন্ত হয়ে গেছ যে, আকাশে যিনি আছেন, তিনি তোমাদের উপর প্রস্তর বৃষ্টি বর্ষণ করবেন, অতঃপর তোমরা জানতে পারবে কেমন ছিল আমার সতর্কবাণী।',
    },
    {
      ayahNumber: 18,
      arabic: 'وَلَقَدْ كَذَّبَ ٱلَّذِينَ مِن قَبْلِهِمْ فَكَيْفَ كَانَ نَكِيرِ',
      banglaPronunciation: 'ওয়া লাক্বাদ কাযযাবাল্লাযীনা মিন ক্বাবলিহিম ফাকাইফা কা-না নাকীর',
      banglaMeaning: 'তাদের পূর্ববর্তীরা মিথ্যারোপ করেছিল, অতঃপর কত কঠোর হয়েছিল আমার অস্বীকৃতি।',
    },
    {
      ayahNumber: 19,
      arabic: 'أَوَلَمْ يَرَوْا۟ إِلَى ٱلطَّيْرِ فَوْقَهُمْ صَٰٓفَّٰتٍۢ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا ٱلرَّحْمَٰنُ ۚ إِنَّهُۥ بِكُلِّ شَىْءٍۭ بَصِيرٌ',
      banglaPronunciation: 'আওয়ালাম ইয়ারাও ইলাত-তাইরি ফাওক্বাহুম সা-ফ্ফা-তিও ওয়া ইয়াক্ববিদন, মা- ইউমসিকুহুন্না ইল্লার রাহমা-ন, ইন্নাহূ বিকুল্লি শাই-ইম বাসীর',
      banglaMeaning: 'তারা কি লক্ষ্য করে না, তাদের মাথার উপর উড়ন্ত পক্ষীকুলের প্রতি পাখা বিস্তারকারী ও পাখা সংকোচনকারী? রহমান আল্লাহ-ই তাদেরকে স্থির রাখেন। তিনি সর্ব-বিষয় দেখেন।',
    },
    {
      ayahNumber: 20,
      arabic: 'أَمَّنْ هَٰذَا ٱلَّذِى هُوَ جُندٌۭ لَّكُمْ يَنصُرُكُم مِّن دُونِ ٱلرَّحْمَٰنِ ۚ إِنِ ٱلْكَٰفِرُونَ إِلَّا فِى غُرُورٍ',
      banglaPronunciation: 'আম্মান হা-যাল্লাযী হুওয়া জুনদুল লাকুম ইয়ানসুরুকুম মিন দূনির রাহমা-ন, ইনিল কা-ফিরূনা ইল্লা- ফী গুরূর',
      banglaMeaning: 'রহমান আল্লাহ তা’আলা ব্যতীত তোমাদের কোন সৈন্য আছে কি, যে তোমাদেরকে সাহায্য করবে? কাফেররা বিভ্রান্তিতেই পতিত আছে।',
    },
    {
      ayahNumber: 21,
      arabic: 'أَمَّنْ هَٰذَا ٱلَّذِى يَرْزُقُكُمْ إِنْ أَمْسَكَ رِزْقَهُۥ ۚ بَل لَّجُّوا۟ فِى عُتُوٍّۢ وَنُفُورٍ',
      banglaPronunciation: 'আম্মান হা-যাল্লাযী ইয়ারযুক্বুকুম ইন আমসাকা রিযক্বাহ, বাল লাজ্জূ ফী উতুওউইও ওয়া নুফূর',
      banglaMeaning: 'তিনি যদি রিযিক বন্ধ করে দেন, তবে কে আছে, যে তোমাদেরকে রিযিক দিবে? বরং তারা অবাধ্যতা ও বিমুখতায় ডুবে রয়েছে।',
    },
    {
      ayahNumber: 22,
      arabic: 'أَفَمَن يَمْشِى مُكِبًّا عَلَىٰ وَجْهِهِۦٓ أَهْدَىٰٓ أَمَّن يَمْشِى سَوِيًّا عَلَىٰ صِرَٰطٍۢ مُّسْتَقِيمٍۢ',
      banglaPronunciation: 'আফামাইঁ-ইয়ামশী মুকিব্বান আলা- ওয়াজহিহী আহদা- আম্মাইঁ-ইয়ামশী সাউইয়্যান আলা- সিরা-তিম মুসতাক্বীম',
      banglaMeaning: 'যে ব্যক্তি উপুড় হয়ে মুখে ভর দিয়ে চলে, সে-ই কি সৎ পথে চলে, না সে ব্যক্তি যে সোজা হয়ে সরলপথে চলে?',
    },
    {
      ayahNumber: 23,
      arabic: 'قُلْ هُوَ ٱلَّذِىٓ أَنشَأَكُمْ وَجَعَلَ لَكُمُ ٱلسَّمْعَ وَٱلْأَبْصَٰرَ وَٱلْأَفْـِٔدَةَ ۖ قَلِيلًۭا مَّا تَشْكُرُونَ',
      banglaPronunciation: 'ক্বুল হুওয়াল্লাযী আনশাআকুম ওয়া জা’আলা লাকুমুস সাম’আ ওয়াল আবসা-রা ওয়াল আফ-ইদাহ, ক্বালীলান মা- তাশকুরূন',
      banglaMeaning: 'বলুন, তিনিই তোমাদেরকে সৃষ্টি করেছেন এবং দিয়েছেন কর্ণ, চক্ষু ও অন্তর। তোমরা অল্পই কৃতজ্ঞতা প্রকাশ কর।',
    },
    {
      ayahNumber: 24,
      arabic: 'قُلْ هُوَ ٱلَّذِى ذَرَأَكُمْ فِى ٱلْأَرْضِ وَإِلَيْهِ تُحْشَرُونَ',
      banglaPronunciation: 'ক্বুল হুওয়াল্লাযী যারা-আকুম ফিল আরদি ওয়া ইলাইহি তুহশারূন',
      banglaMeaning: 'বলুন, তিনিই তোমাদেরকে পৃথিবীতে বিস্তৃত করেছেন এবং তাঁরই কাছে তোমরা সমবেত হবে।',
    },
    {
      ayahNumber: 25,
      arabic: 'وَيَقُولُونَ مَتَىٰ هَٰذَا ٱلْوَعْدُ إِن كُنتُمْ صَٰدِقِينَ',
      banglaPronunciation: 'ওয়া ইয়াক্বূলূনা মাতা- হা-যাল ওয়া’দু ইন কুনতুম সা-দিক্বীন',
      banglaMeaning: 'কাফেররা বলে: এই প্রতিশ্রুতি কবে হবে, যদি তোমরা সত্যবাদী হও?',
    },
    {
      ayahNumber: 26,
      arabic: 'قُلْ إِنَّمَا ٱلْعِلْمُ عِندَ ٱللَّهِ وَإِنَّمَآ أَنَا۠ نَذِيرٌۭ مُّبِينٌۭ',
      banglaPronunciation: 'ক্বুল ইন্নামাল ইলমু ইনদাল্লা-হি ওয়া ইন্নামা- আনা নাযীরুম মুবীন',
      banglaMeaning: 'বলুন, এর জ্ঞান আল্লাহ তা’আলার কাছেই আছে। আমি তো কেবল প্রকাশ্য সতর্ককারী।',
    },
    {
      ayahNumber: 27,
      arabic: 'فَلَمَّا رَأَوْهُ زُلْفَةًۭ سِيٓـَٔتْ وُجُوهُ ٱلَّذِينَ كَفَرُوا۟ وَقِيلَ هَٰذَا ٱلَّذِى كُنتُم بِهِۦ تَدَّعُونَ',
      banglaPronunciation: 'ফালাম্মা- রাআওহু যুলফাতান সী-আত উজূহুল্লাযীনা কাফারূ ওয়া ক্বীলা হা-যাল্লাযী কুনতুম বিহী তাদ্দা’ঊন',
      banglaMeaning: 'যখন তারা সেই প্রতিশ্রুতিকে আসন্ন দেখবে তখন কাফেরদের মুখমন্ডল মলিন হয়ে পড়বে এবং বলা হবে: এটাই তো তোমরা চাইতে।',
    },
    {
      ayahNumber: 28,
      arabic: 'قُلْ أَرَءَيْتُمْ إِنْ أَهْلَكَنِىَ ٱللَّهُ وَمَن مَّعِىَ أَوْ رَحِمَنَا فَمَن يُجِيرُ ٱلْكَٰفِرِينَ مِنْ عَذَابٍ أَلِيمٍۢ',
      banglaPronunciation: 'ক্বুল আরাআইতুম ইন আহলাকানিয়াল্লা-হু ওয়া মাম মা’ইয়া আও রাহিমানা- ফামাইঁ-ইউজীরুল কা-ফিরীনা মিন আযা-বিন আলীম',
      banglaMeaning: 'বলুন, তোমরা কি ভেবে দেখেছ-যদি আল্লাহ তা’আলা আমাকে ও আমার সংগীদেরকে ধ্বংস করেন অথবা আমাদের প্রতি দয়া করেন, তবে কাফেরদেরকে কে যন্ত্রণাদায়ক শাস্তি থেকে রক্ষা করবে?',
    },
    {
      ayahNumber: 29,
      arabic: 'قُلْ هُوَ ٱلرَّحْمَٰنُ ءَامَنَّا بِهِۦ وَعَلَيْهِ تَوَكَّلْنَا ۖ فَسَتَعْلَمُونَ مَنْ هُوَ فِى ضَلَٰلٍۢ مُّبِينٍۢ',
      banglaPronunciation: 'ক্বুল হুওয়ার রাহমা-নু আ-মান্না- বিহী ওয়া আলাইহি তাওয়াক্কালনা, ফাসাতা’লামূনা মান হুওয়া ফী দালা-লিম মুবীন',
      banglaMeaning: 'বলুন, তিনি পরম করুণাময়, আমরা তাতে বিশ্বাস রাখি এবং তাঁরই উপর ভরসা করি। সত্বরই তোমরা জানতে পারবে, কে প্রকাশ্য পথ-ভ্রষ্টতায় আছে।',
    },
    {
      ayahNumber: 30,
      arabic: 'قُلْ أَرَءَيْتُمْ إِنْ أَصْبَحَ مَآؤُكُمْ غَوْرًۭا فَمَن يَأْتِيكُم بِمَآءٍۢ مَّعِينٍۭ',
      banglaPronunciation: 'ক্বুল আরাআইতুম ইন আসবাহা মা-উকুম গাওরান ফামাইঁ-ইয়া’তীকুম বিমা-ইম মা’ঈন',
      banglaMeaning: 'বলুন, তোমরা ভেবে দেখেছ কি, যদি তোমাদের পানি ভূগর্ভের গভীরে চলে যায়, তবে কে তোমাদেরকে সরবরাহ করবে পানির স্রোতধারা?',
    },
  ],
};

export const QURAN_DAILY_TRACKS: QuranTrack[] = [
  {
    id: 'pair-fatihah-asr',
    isPairedShortSurah: true,
    surahName: 'Surah Al-Fatihah + Surah Al-Asr',
    arabicTitle: 'سورة الفاتحة + سورة العصر',
    reciter: 'Mishary Rashid Alafasy',
    durationLabel: '5:00 Paired Session (2 Surahs)',
    surahs: [AL_FATIHAH, AL_ASR],
    reflectionEnglish: 'Seek guidance on the straight path and guard every moment of your time.',
    reflectionBangla: '২টি ছোট সূরা: সরল পথের দোয়া এবং সময়ের গুরুত্ব নিয়ে ৫ মিনিটের তিলাওয়াত ও ভাবনা।',
  },
  {
    id: 'pair-duha-sharh',
    isPairedShortSurah: true,
    surahName: 'Surah Ad-Duha + Surah Ash-Sharh',
    arabicTitle: 'سورة الضحى + سورة الشرح',
    reciter: 'Mishary Rashid Alafasy',
    durationLabel: '5:00 Paired Session (2 Surahs)',
    surahs: [AD_DUHA, ASH_SHARH],
    reflectionEnglish: 'With every hardship comes ease — your Lord has never forsaken you.',
    reflectionBangla: '২টি ছোট সূরা: হতাশা কাটিয়ে প্রশান্তি ও প্রতিটি কষ্টের পর স্বস্তির আশ্বাস।',
  },
  {
    id: 'pair-tin-qadr',
    isPairedShortSurah: true,
    surahName: 'Surah At-Tin + Surah Al-Qadr',
    arabicTitle: 'سورة التين + سورة القدر',
    reciter: 'Mishary Rashid Alafasy',
    durationLabel: '5:00 Paired Session (2 Surahs)',
    surahs: [AT_TIN, AL_QADR],
    reflectionEnglish: 'Humanity is created in excellence and honored through the revelation of the Quran.',
    reflectionBangla: '২টি ছোট সূরা: মানুষের শ্রেষ্ঠ সৃষ্টি ও মহিমান্বিত কদরের রজনীর স্মরণ।',
  },
  {
    id: 'pair-kawthar-ikhlas',
    isPairedShortSurah: true,
    surahName: 'Surah Al-Kawthar + Surah Al-Ikhlas',
    arabicTitle: 'سورة الكوثر + سورة الإخلاص',
    reciter: 'Mishary Rashid Alafasy',
    durationLabel: '5:00 Paired Session (2 Surahs)',
    surahs: [AL_KAWTHAR, AL_IKHLAS],
    reflectionEnglish: 'Pure gratitude for abundance and pure Tawhid in one daily session.',
    reflectionBangla: '২টি ছোট সূরা: আল্লাহর অসীম অনুগ্রহের শুকরিয়া ও একত্ববাদের বিশুদ্ধ ঘোষণা।',
  },
  {
    id: 'pair-falaq-nas',
    isPairedShortSurah: true,
    surahName: 'Surah Al-Falaq + Surah An-Nas',
    arabicTitle: 'سورة الفلق + سورة الناس',
    reciter: 'Mishary Rashid Alafasy',
    durationLabel: '5:00 Paired Session (2 Surahs)',
    surahs: [AL_FALAQ, AN_NAS],
    reflectionEnglish: 'The two Surahs of protection (Al-Mu’awwidhatayn) for peace of heart and focus.',
    reflectionBangla: '২টি ছোট সূরা: সব অনিষ্ট ও দুশ্চিন্তা থেকে আল্লাহর আশ্রয় চাওয়ার সুরক্ষামূলক সূরা।',
  },
  {
    id: 'pair-fil-quraysh',
    isPairedShortSurah: true,
    surahName: 'Surah Al-Fil + Surah Quraysh',
    arabicTitle: 'سورة الفيل + سورة قريش',
    reciter: 'Mishary Rashid Alafasy',
    durationLabel: '5:00 Paired Session (2 Surahs)',
    surahs: [AL_FIL, QURAYSH],
    reflectionEnglish: 'Reflect on divine protection and gratitude for provision and safety.',
    reflectionBangla: '২টি ছোট সূরা: আল্লাহর অসীম ক্ষমতা ও জীবিকা ও নিরাপত্তার জন্য শুকরিয়া।',
  },
  {
    id: 'single-al-ala',
    isPairedShortSurah: false,
    surahName: 'Surah Al-A’la (19 Ayats)',
    arabicTitle: 'سورة الأعلى',
    reciter: 'Mishary Rashid Alafasy',
    durationLabel: '5:00 Full Surah Session',
    surahs: [AL_ALA],
    reflectionEnglish: 'Glorify the Most High, purify the soul, and value lasting success over distraction.',
    reflectionBangla: 'মহান প্রতিপালকের পবিত্রতা ঘোষণা, আত্মশুদ্ধি ও পরকালীন সফলতার শিক্ষা।',
  },
  {
    id: 'single-ash-shams',
    isPairedShortSurah: false,
    surahName: 'Surah Ash-Shams (15 Ayats)',
    arabicTitle: 'سُورَةُ الشَّمۡسِ',
    reciter: 'Mishary Rashid Alafasy',
    durationLabel: '5:00 Full Surah Session',
    surahs: [ASH_SHAMS],
    reflectionEnglish: 'He truly succeeds who purifies his soul and acts with integrity.',
    reflectionBangla: 'প্রকৃতির নিদর্শন ও আত্মশুদ্ধির মাধ্যমে প্রকৃত সফলতা অর্জনের দিকনির্দেশনা।',
  },
  {
    id: 'single-al-ghashiyah',
    isPairedShortSurah: false,
    surahName: 'Surah Al-Ghashiyah (26 Ayats)',
    arabicTitle: 'سورة الغاشية',
    reciter: 'Mishary Rashid Alafasy',
    durationLabel: '5:00 Full Surah Session',
    surahs: [AL_GHASHIYAH],
    reflectionEnglish: 'Observe creation around you and remember ultimate accountability.',
    reflectionBangla: 'সৃষ্টিজগতের বিস্ময় নিয়ে চিন্তা ও আখিরাতের জবাবদিহিতার স্মরণ।',
  },
  {
    id: 'single-al-mulk',
    isPairedShortSurah: false,
    surahName: 'Surah Al-Mulk (30 Ayats)',
    arabicTitle: 'سورة الملك',
    reciter: 'Mishary Rashid Alafasy',
    durationLabel: '5:00 Full Surah Session',
    surahs: [AL_MULK],
    reflectionEnglish: 'He created life and death to test who is best in deeds and excellence.',
    reflectionBangla: 'জীবন ও মৃত্যুর উদ্দেশ্য, শ্রেষ্ঠ আমল এবং আল্লাহর অসীম ক্ষমতার গভীর উপলব্ধি।',
  },
];
