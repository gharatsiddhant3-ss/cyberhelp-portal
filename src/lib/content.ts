import type { Lang } from "./i18n";
type L<T = string> = Record<Lang, T>;

export const nav: { to: string; label: L }[] = [
  { to: "/", label: { en: "Home", hi: "होम", mr: "मुख्यपृष्ठ" } },
  { to: "/awareness", label: { en: "Awareness", hi: "जागरूकता", mr: "जागरूकता" } },
  { to: "/report", label: { en: "Report & Helpline", hi: "रिपोर्ट व हेल्पलाइन", mr: "तक्रार व हेल्पलाइन" } },
  { to: "/safety", label: { en: "Safety Tips", hi: "सुरक्षा टिप्स", mr: "सुरक्षा टिप्स" } },
  { to: "/quiz", label: { en: "Quiz", hi: "क्विज़", mr: "प्रश्नमंजुषा" } },
  { to: "/breach-check", label: { en: "Leak Check", hi: "लीक जांच", mr: "लीक तपासणी" } },
  { to: "/survey", label: { en: "Survey Results", hi: "सर्वे परिणाम", mr: "सर्वेक्षण निकाल" } },
  { to: "/contact", label: { en: "Contact Us", hi: "संपर्क करें", mr: "संपर्क करा" } },
];

// Paste the Google Form "fill out" link here (open your form -> Send -> link icon).
// The "Take the survey" buttons only appear once a real link is set below.
export const surveyFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSf73q5YaOMz8x_ArDXrJTI7xhaJJTXucOzdJ8SZWb6fxKk3fg/viewform";
export const hasSurveyForm = /^https?:\/\//.test(surveyFormUrl);

export const surveyCta = {
  title: { en: "Take the cyber-awareness survey", hi: "साइबर-जागरूकता सर्वे भरें", mr: "सायबर-जागरूकता सर्वेक्षण भरा" },
  sub: {
    en: "Takes about 3 minutes. Your answers go straight into the live results.",
    hi: "लगभग 3 मिनट लगेंगे। आपकी जवामें सीधे लाइव नतीजों में जुड़ती हैं।",
    mr: "सुमार 3 मिनिटे लागतात. तुमचे प्रतिसाद लगेच निकालांत सामील होतात.",
  },
  cta: { en: "Open survey", hi: "सर्वे खोलें", mr: "सर्वेक्षण उघडा" },
};

export const home = {
  badge: { en: "Free cyber help for everyone", hi: "सभी के लिए मुफ्त साइबर सहायता", mr: "सर्वांसाठी मोफत सायबर मदत" },
  title: { en: "Scammed, hacked or unsure? We're here to help.", hi: "ठगी, हैकिंग या संदेह? हम मदद के लिए हैं।", mr: "फसवणूक, हॅकिंग किंवा शंका? आम्ही मदतीला आहोत." },
  sub: {
    en: "Learn how to stay safe online, report cybercrime fast, and check if your email was leaked.",
    hi: "ऑनलाइन सुरक्षित रहना सीखें, साइबर अपराध की तुरंत रिपोर्ट करें, और जांचें कि आपका ईमेल लीक हुआ या नहीं।",
    mr: "ऑनलाइन सुरक्षित कसे राहायचे ते शिका, सायबर गुन्ह्याची त्वरित तक्रार करा आणि तुमचा ईमेल लीक झाला का ते तपासा.",
  },
  cta: { en: "Get help now", hi: "अभी मदद लें", mr: "आता मदत घ्या" },
  check: { en: "Check email leak", hi: "ईमेल लीक जांचें", mr: "ईमेल लीक तपासा" },
  emergency: {
    en: "Lost money to fraud? Call 1930 immediately — the first hours matter most.",
    hi: "धोखाधड़ी में पैसे गए? तुरंत 1930 पर कॉल करें — पहले कुछ घंटे सबसे महत्वपूर्ण हैं।",
    mr: "फसवणुकीत पैसे गेले? लगेच 1930 वर कॉल करा — पहिले काही तास सर्वात महत्त्वाचे.",
  },
};

export const articles: { title: L; body: L }[] = [
  {
    title: { en: "UPI & payment fraud", hi: "UPI और भुगतान धोखाधड़ी", mr: "UPI व पेमेंट फसवणूक" },
    body: {
      en: "You never need to enter your UPI PIN to receive money. Scammers send 'collect requests' disguised as refunds or prizes. Always read the screen before entering your PIN.",
      hi: "पैसे प्राप्त करने के लिए कभी UPI PIN नहीं डालना पड़ता। ठग रिफंड या इनाम के नाम पर 'कलेक्ट रिक्वेस्ट' भेजते हैं। PIN डालने से पहले स्क्रीन ध्यान से पढ़ें।",
      mr: "पैसे मिळवण्यासाठी UPI PIN टाकावा लागत नाही. फसवणूक करणारे रिफंड किंवा बक्षिसाच्या नावाने 'कलेक्ट रिक्वेस्ट' पाठवतात. PIN टाकण्यापूर्वी स्क्रीन नीट वाचा.",
    },
  },
  {
    title: { en: "Phishing messages & fake websites", hi: "फ़िशिंग संदेश और नकली वेबसाइट", mr: "फिशिंग मेसेज व बनावट वेबसाइट" },
    body: {
      en: "Fake SMS, emails and WhatsApp messages copy banks, courier services and government offices to steal passwords and OTPs. Urgency ('account blocked today!') is the biggest red flag.",
      hi: "नकली SMS, ईमेल और WhatsApp संदेश बैंक, कूरियर और सरकारी दफ्तरों की नकल कर पासवर्ड और OTP चुराते हैं। जल्दबाज़ी ('आज खाता बंद!') सबसे बड़ा खतरे का संकेत है।",
      mr: "बनावट SMS, ईमेल व WhatsApp मेसेज बँक, कुरिअर आणि सरकारी कार्यालयांची नक्कल करून पासवर्ड व OTP चोरतात. घाई ('आज खाते बंद!') हा सर्वात मोठा धोक्याचा इशारा आहे.",
    },
  },
  {
    title: { en: "'Digital arrest' scams", hi: "'डिजिटल अरेस्ट' घोटाले", mr: "'डिजिटल अरेस्ट' घोटाळे" },
    body: {
      en: "Callers pretending to be police, CBI or customs claim you're under investigation and demand money over video call. Real police never arrest anyone over video or ask for payment.",
      hi: "पुलिस, CBI या कस्टम बनकर कॉल करने वाले कहते हैं कि आप जांच में हैं और वीडियो कॉल पर पैसे मांगते हैं। असली पुलिस वीडियो पर गिरफ्तारी नहीं करती और न ही पैसे मांगती है।",
      mr: "पोलीस, CBI किंवा कस्टम्स असल्याचे भासवणारे कॉलर तुमची चौकशी सुरू असल्याचे सांगून व्हिडिओ कॉलवर पैसे मागतात. खरे पोलीस व्हिडिओवर अटक करत नाहीत किंवा पैसे मागत नाहीत.",
    },
  },
  {
    title: { en: "Fake jobs & investment offers", hi: "नकली नौकरी और निवेश ऑफर", mr: "बनावट नोकरी व गुंतवणूक ऑफर" },
    body: {
      en: "'Like videos and earn' tasks, crypto tips on Telegram and guaranteed-return schemes start with small payouts to win trust, then take large deposits and disappear.",
      hi: "'वीडियो लाइक करें और कमाएं', Telegram पर क्रिप्टो टिप्स और गारंटीड रिटर्न योजनाएं पहले छोटा भुगतान देकर भरोसा जीतती हैं, फिर बड़ी रकम लेकर गायब हो जाती हैं।",
      mr: "'व्हिडिओ लाइक करा आणि कमवा', Telegram वरील क्रिप्टो टिप्स आणि हमखास परताव्याच्या योजना आधी छोटे पैसे देऊन विश्वास जिंकतात, मग मोठी रक्कम घेऊन गायब होतात.",
    },
  },
  {
    title: { en: "Sextortion & social media blackmail", hi: "सेक्सटॉर्शन और सोशल मीडिया ब्लैकमेल", mr: "सेक्सटॉर्शन व सोशल मीडिया ब्लॅकमेल" },
    body: {
      en: "Don't pay blackmailers — payment leads to more demands. Stop contact, save evidence, report the profile, and file a complaint. You are not at fault.",
      hi: "ब्लैकमेलर को पैसे न दें — इससे मांगें बढ़ती हैं। संपर्क बंद करें, सबूत सहेजें, प्रोफ़ाइल रिपोर्ट करें और शिकायत दर्ज करें। आपकी कोई गलती नहीं है।",
      mr: "ब्लॅकमेल करणाऱ्याला पैसे देऊ नका — त्याने मागण्या वाढतात. संपर्क थांबवा, पुरावे जपा, प्रोफाइल रिपोर्ट करा आणि तक्रार नोंदवा. तुमची चूक नाही.",
    },
  },
  {
    title: { en: "SIM swap & account takeover", hi: "SIM स्वैप और अकाउंट हाइजैक", mr: "SIM स्वॅप व अकाउंट ताबा" },
    body: {
      en: "If your phone suddenly loses signal for long, contact your mobile operator — criminals may have cloned your SIM to receive your OTPs. Use app-based 2-step verification where possible.",
      hi: "अगर फोन का नेटवर्क अचानक लंबे समय तक चला जाए, तो मोबाइल ऑपरेटर से संपर्क करें — अपराधी OTP पाने के लिए SIM क्लोन कर सकते हैं। जहां संभव हो, ऐप आधारित 2-स्टेप वेरिफिकेशन इस्तेमाल करें।",
      mr: "फोनचे नेटवर्क अचानक बराच वेळ गेले तर मोबाइल ऑपरेटरशी संपर्क करा — गुन्हेगार OTP मिळवण्यासाठी SIM क्लोन करू शकतात. शक्य तिथे अॅप-आधारित 2-स्टेप व्हेरिफिकेशन वापरा.",
    },
  },
];

export const reportSteps: L[] = [
  { en: "Stay calm. Do not delete anything — chats, SMS, call logs and screenshots are evidence.", hi: "शांत रहें। कुछ भी डिलीट न करें — चैट, SMS, कॉल लॉग और स्क्रीनशॉट सबूत हैं।", mr: "शांत रहा. काहीही डिलीट करू नका — चॅट, SMS, कॉल लॉग व स्क्रीनशॉट हे पुरावे आहेत." },
  { en: "If money was lost, call 1930 within the first hour (the 'golden hour') so the bank can freeze the transfer.", hi: "पैसे गए हों तो पहले घंटे ('गोल्डन आवर') में 1930 पर कॉल करें ताकि बैंक ट्रांसफर रोक सके।", mr: "पैसे गेले असल्यास पहिल्या तासात ('गोल्डन अवर') 1930 वर कॉल करा, म्हणजे बँक व्यवहार गोठवू शकेल." },
  { en: "Call your bank's official number to block cards / UPI and note the transaction IDs.", hi: "बैंक के आधिकारिक नंबर पर कॉल कर कार्ड / UPI ब्लॉक करें और ट्रांज़ैक्शन ID नोट करें।", mr: "बँकेच्या अधिकृत क्रमांकावर कॉल करून कार्ड / UPI ब्लॉक करा आणि ट्रान्झॅक्शन ID नोंदवा." },
  { en: "File a complaint at cybercrime.gov.in with all details and evidence. Save the acknowledgement number.", hi: "cybercrime.gov.in पर सभी विवरण और सबूत के साथ शिकायत दर्ज करें। पावती नंबर सहेजें।", mr: "cybercrime.gov.in वर सर्व तपशील व पुराव्यांसह तक्रार नोंदवा. पोच क्रमांक जपून ठेवा." },
  { en: "Change passwords of affected accounts and enable 2-step verification.", hi: "प्रभावित खातों के पासवर्ड बदलें और 2-स्टेप वेरिफिकेशन चालू करें।", mr: "प्रभावित खात्यांचे पासवर्ड बदला आणि 2-स्टेप व्हेरिफिकेशन सुरू करा." },
  { en: "Report fraud calls/SMS on the Sanchar Saathi portal (Chakshu) and visit your nearest cyber police station if needed.", hi: "फ्रॉड कॉल/SMS की रिपोर्ट संचार साथी (चक्षु) पर करें और ज़रूरत हो तो नज़दीकी साइबर पुलिस स्टेशन जाएं।", mr: "फसव्या कॉल/SMS ची तक्रार संचार साथी (चक्षु) वर करा आणि गरज असल्यास जवळच्या सायबर पोलीस ठाण्यात जा." },
];

export const helplines: { num: string; name: L; href: string }[] = [
  { num: "1930", name: { en: "National Cyber Crime Helpline", hi: "राष्ट्रीय साइबर अपराध हेल्पलाइन", mr: "राष्ट्रीय सायबर गुन्हे हेल्पलाइन" }, href: "tel:1930" },
  { num: "112", name: { en: "Emergency (Police / Ambulance)", hi: "आपातकाल (पुलिस / एम्बुलेंस)", mr: "आपत्कालीन (पोलीस / रुग्णवाहिका)" }, href: "tel:112" },
  { num: "1091", name: { en: "Women Helpline", hi: "महिला हेल्पलाइन", mr: "महिला हेल्पलाइन" }, href: "tel:1091" },
  { num: "1098", name: { en: "Child Helpline", hi: "चाइल्ड हेल्पलाइन", mr: "बाल हेल्पलाइन" }, href: "tel:1098" },
  { num: "cybercrime.gov.in", name: { en: "Online complaint portal", hi: "ऑनलाइन शिकायत पोर्टल", mr: "ऑनलाइन तक्रार पोर्टल" }, href: "https://cybercrime.gov.in" },
  { num: "sancharsaathi.gov.in", name: { en: "Report fraud calls / lost phone", hi: "फ्रॉड कॉल / खोया फोन रिपोर्ट", mr: "फसवे कॉल / हरवलेला फोन तक्रार" }, href: "https://sancharsaathi.gov.in" },
];

export const tips: L[] = [
  { en: "Never share OTP, PIN, CVV or passwords — not even with 'bank officials'.", hi: "OTP, PIN, CVV या पासवर्ड कभी साझा न करें — 'बैंक अधिकारी' से भी नहीं।", mr: "OTP, PIN, CVV किंवा पासवर्ड कधीही शेअर करू नका — 'बँक अधिकाऱ्यां'नाही नाही." },
  { en: "Use a different strong password for every account, or a password manager.", hi: "हर खाते के लिए अलग मजबूत पासवर्ड या पासवर्ड मैनेजर इस्तेमाल करें।", mr: "प्रत्येक खात्यासाठी वेगळा मजबूत पासवर्ड किंवा पासवर्ड मॅनेजर वापरा." },
  { en: "Turn on 2-step verification for email, WhatsApp, banking and social media.", hi: "ईमेल, WhatsApp, बैंकिंग और सोशल मीडिया पर 2-स्टेप वेरिफिकेशन चालू करें।", mr: "ईमेल, WhatsApp, बँकिंग व सोशल मीडियावर 2-स्टेप व्हेरिफिकेशन सुरू करा." },
  { en: "Install apps only from Play Store / App Store. Never install screen-sharing apps on a stranger's request.", hi: "ऐप केवल Play Store / App Store से इंस्टॉल करें। अनजान के कहने पर स्क्रीन-शेयरिंग ऐप न डालें।", mr: "अॅप्स फक्त Play Store / App Store वरून घ्या. अनोळखी व्यक्तीच्या सांगण्यावर स्क्रीन-शेअरिंग अॅप टाकू नका." },
  { en: "Keep your phone and apps updated.", hi: "फोन और ऐप्स अपडेट रखें।", mr: "फोन आणि अॅप्स अपडेट ठेवा." },
  { en: "Make social media profiles private and avoid posting travel plans, ID cards or tickets.", hi: "सोशल मीडिया प्रोफ़ाइल प्राइवेट रखें; यात्रा योजना, ID कार्ड या टिकट पोस्ट न करें।", mr: "सोशल मीडिया प्रोफाइल प्रायव्हेट ठेवा; प्रवास योजना, ओळखपत्र किंवा तिकिटे पोस्ट करू नका." },
  { en: "Verify unexpected requests for money from 'friends' by calling them directly.", hi: "'दोस्तों' की अचानक पैसे की मांग की पुष्टि उन्हें सीधे कॉल करके करें।", mr: "'मित्रां'कडून अचानक पैशांची मागणी आल्यास त्यांना थेट फोन करून खात्री करा." },
  { en: "Avoid banking on public Wi-Fi.", hi: "सार्वजनिक Wi-Fi पर बैंकिंग न करें।", mr: "सार्वजनिक Wi-Fi वर बँकिंग करू नका." },
];

export const linkSigns: L[] = [
  { en: "Misspelled brand names: amaz0n-offer.in, sbi-kyc-update.xyz", hi: "गलत स्पेलिंग वाले नाम: amaz0n-offer.in, sbi-kyc-update.xyz", mr: "चुकीच्या स्पेलिंगची नावे: amaz0n-offer.in, sbi-kyc-update.xyz" },
  { en: "Shortened links (bit.ly, tinyurl) from unknown senders", hi: "अनजान भेजने वाले के छोटे लिंक (bit.ly, tinyurl)", mr: "अनोळखी पाठवणाऱ्याकडून आलेल्या छोट्या लिंक (bit.ly, tinyurl)" },
  { en: "Unusual endings like .xyz, .top, .click, or plain IP addresses", hi: ".xyz, .top, .click जैसे असामान्य अंत या केवल IP पता", mr: ".xyz, .top, .click सारखे असामान्य शेवट किंवा फक्त IP पत्ता" },
  { en: "Messages creating panic: 'KYC expires today', 'electricity cut tonight'", hi: "घबराहट वाले संदेश: 'KYC आज खत्म', 'आज रात बिजली कटेगी'", mr: "घाबरवणारे मेसेज: 'KYC आज संपेल', 'आज रात्री वीज कापली जाईल'" },
  { en: "Pages asking for OTP, PIN, card details or an APK download", hi: "OTP, PIN, कार्ड विवरण या APK डाउनलोड मांगने वाले पेज", mr: "OTP, PIN, कार्ड तपशील किंवा APK डाउनलोड मागणारी पेजेस" },
];

export const linkDo: L[] = [
  { en: "Don't click — type the official website address yourself.", hi: "क्लिक न करें — आधिकारिक वेबसाइट का पता खुद टाइप करें।", mr: "क्लिक करू नका — अधिकृत वेबसाइटचा पत्ता स्वतः टाइप करा." },
  { en: "Long-press the link to preview the real address before opening.", hi: "खोलने से पहले लिंक पर देर तक दबाकर असली पता देखें।", mr: "उघडण्यापूर्वी लिंकवर दीर्घ दाबून खरा पत्ता पाहा." },
  { en: "Check suspicious links on a scanner like VirusTotal.", hi: "संदिग्ध लिंक VirusTotal जैसे स्कैनर पर जांचें।", mr: "संशयास्पद लिंक VirusTotal सारख्या स्कॅनरवर तपासा." },
  { en: "Already clicked? Disconnect internet, uninstall unknown apps, change passwords, inform your bank.", hi: "पहले ही क्लिक कर दिया? इंटरनेट बंद करें, अनजान ऐप हटाएं, पासवर्ड बदलें, बैंक को बताएं।", mr: "आधीच क्लिक केले? इंटरनेट बंद करा, अनोळखी अॅप्स काढा, पासवर्ड बदला, बँकेला कळवा." },
];

export const quiz: { q: L; options: L<string[]>; answer: number; why: L }[] = [
  {
    q: { en: "A caller from 'your bank' asks for the OTP to stop your card from being blocked. What do you do?", hi: "'बैंक' से कॉल आती है और कार्ड ब्लॉक रोकने के लिए OTP मांगा जाता है। आप क्या करेंगे?", mr: "'बँके'तून कॉल येतो आणि कार्ड ब्लॉक थांबवण्यासाठी OTP मागतात. तुम्ही काय कराल?" },
    options: { en: ["Share the OTP", "Hang up and call the bank's official number", "Share only half"], hi: ["OTP बता दूंगा", "फोन काटकर बैंक के आधिकारिक नंबर पर कॉल करूंगा", "आधा बताऊंगा"], mr: ["OTP सांगेन", "फोन ठेवून बँकेच्या अधिकृत क्रमांकावर कॉल करेन", "अर्धा सांगेन"] },
    answer: 1,
    why: { en: "Banks never ask for OTPs.", hi: "बैंक कभी OTP नहीं मांगते।", mr: "बँका कधीही OTP मागत नाहीत." },
  },
  {
    q: { en: "To receive ₹500 on UPI, do you need to enter your PIN?", hi: "UPI पर ₹500 प्राप्त करने के लिए क्या PIN डालना ज़रूरी है?", mr: "UPI वर ₹500 मिळवण्यासाठी PIN टाकावा लागतो का?" },
    options: { en: ["Yes", "No"], hi: ["हाँ", "नहीं"], mr: ["हो", "नाही"] },
    answer: 1,
    why: { en: "A PIN is only needed to send money.", hi: "PIN केवल पैसे भेजने के लिए चाहिए।", mr: "PIN फक्त पैसे पाठवण्यासाठी लागतो." },
  },
  {
    q: { en: "Which link is most likely fake?", hi: "कौन सा लिंक नकली होने की संभावना सबसे ज़्यादा है?", mr: "कोणती लिंक बनावट असण्याची शक्यता सर्वाधिक?" },
    options: { en: ["https://www.onlinesbi.sbi", "http://sbi-kyc-update.xyz/login", "https://www.irctc.co.in"], hi: ["https://www.onlinesbi.sbi", "http://sbi-kyc-update.xyz/login", "https://www.irctc.co.in"], mr: ["https://www.onlinesbi.sbi", "http://sbi-kyc-update.xyz/login", "https://www.irctc.co.in"] },
    answer: 1,
    why: { en: "Odd domain ending and 'kyc-update' are classic phishing signs.", hi: "अजीब डोमेन और 'kyc-update' फ़िशिंग के आम संकेत हैं।", mr: "विचित्र डोमेन व 'kyc-update' ही फिशिंगची ठळक लक्षणे आहेत." },
  },
  {
    q: { en: "You lost money in a scam. What is the national cyber helpline number?", hi: "धोखाधड़ी में पैसे गए। राष्ट्रीय साइबर हेल्पलाइन नंबर क्या है?", mr: "फसवणुकीत पैसे गेले. राष्ट्रीय सायबर हेल्पलाइन क्रमांक कोणता?" },
    options: { en: ["100", "1930", "101"], hi: ["100", "1930", "101"], mr: ["100", "1930", "101"] },
    answer: 1,
    why: { en: "Call 1930 as fast as possible.", hi: "जितनी जल्दी हो सके 1930 पर कॉल करें।", mr: "शक्य तितक्या लवकर 1930 वर कॉल करा." },
  },
  {
    q: { en: "A 'police officer' on video call says you're under 'digital arrest' and must pay. This is:", hi: "वीडियो कॉल पर 'पुलिस अधिकारी' कहता है कि आप 'डिजिटल अरेस्ट' में हैं और पैसे दें। यह है:", mr: "व्हिडिओ कॉलवर 'पोलीस अधिकारी' म्हणतो तुम्ही 'डिजिटल अरेस्ट' मध्ये आहात, पैसे भरा. हे आहे:" },
    options: { en: ["A real legal process", "A scam"], hi: ["असली कानूनी प्रक्रिया", "घोटाला"], mr: ["खरी कायदेशीर प्रक्रिया", "घोटाळा"] },
    answer: 1,
    why: { en: "There is no 'digital arrest' in Indian law.", hi: "भारतीय कानून में 'डिजिटल अरेस्ट' नाम की कोई चीज़ नहीं।", mr: "भारतीय कायद्यात 'डिजिटल अरेस्ट' असे काहीही नाही." },
  },
  {
    q: { en: "Best way to protect your email account?", hi: "ईमेल खाते को सुरक्षित रखने का सबसे अच्छा तरीका?", mr: "ईमेल खाते सुरक्षित ठेवण्याचा सर्वोत्तम मार्ग?" },
    options: { en: ["Same password everywhere", "Strong unique password + 2-step verification", "Write password on phone wallpaper"], hi: ["हर जगह एक ही पासवर्ड", "मजबूत अलग पासवर्ड + 2-स्टेप वेरिफिकेशन", "पासवर्ड वॉलपेपर पर लिखना"], mr: ["सगळीकडे एकच पासवर्ड", "मजबूत वेगळा पासवर्ड + 2-स्टेप व्हेरिफिकेशन", "पासवर्ड वॉलपेपरवर लिहिणे"] },
    answer: 1,
    why: { en: "Unique passwords stop one leak from opening all accounts.", hi: "अलग पासवर्ड से एक लीक सभी खाते नहीं खोल पाता।", mr: "वेगळ्या पासवर्डमुळे एका लीकने सर्व खाती उघडत नाहीत." },
  },
  {
    q: {
      en: "A buyer on OLX sends you a QR code and says: 'Scan this code to receive ₹3,000 for your item'. What should you do?",
      hi: "OLX पर एक खरीदार आपको QR कोड भेजता है और कहता है: 'पैसे प्राप्त करने के लिए इसे स्कैन करें'। आप क्या करेंगे?",
      mr: "OLX वर खरेदीदार QR कोड पाठवून म्हणतो: 'पैसे खात्यात जमा होण्यासाठी हा कोड स्कॅन करा'. तुम्ही काय कराल?",
    },
    options: {
      en: ["Scan the QR code and enter UPI PIN", "Refuse — you never need to scan a QR code to receive money", "Scan it but do not enter PIN"],
      hi: ["QR कोड स्कैन करके UPI PIN दर्ज करेंगे", "मना करेंगे — पैसे प्राप्त करने के लिए कभी QR स्कैन नहीं करना पड़ता", "स्कैन करेंगे लेकिन PIN नहीं डालेंगे"],
      mr: ["QR कोड स्कॅन करून UPI PIN टाकेन", "नकार देईन — पैसे मिळवण्यासाठी कधीही QR कोड स्कॅन करावा लागत नाही", "स्कॅन करेन पण PIN टाकणार नाही"],
    },
    answer: 1,
    why: {
      en: "QR codes and PINs are only used to deduct money from your account, never to receive money.",
      hi: "QR कोड और PIN केवल आपके खाते से पैसे कटने के लिए होते हैं, पैसे आने के लिए नहीं।",
      mr: "QR कोड आणि PIN फक्त तुमच्या खात्यातून पैसे जाण्यासाठी असतात, मिळवण्यासाठी नाही.",
    },
  },
  {
    q: {
      en: "A 'customer care agent' asks you to install AnyDesk or TeamViewer to fix a pending payment. What is the danger?",
      hi: "'कस्टमर केयर' अधिकारी पेंडिंग पेमेंट ठीक करने के लिए AnyDesk या TeamViewer इंस्टॉल करने को कहता है। इसमें क्या खतरा है?",
      mr: "'कस्टमर केअर' प्रतिनिधी पेंडिंग पेमेंट दुरुस्त करण्यासाठी AnyDesk किंवा TeamViewer इन्स्टॉल करायला सांगतो. यात काय धोका आहे?",
    },
    options: {
      en: ["It gives them full live view and control of your phone and OTPs", "It just uses your mobile internet data", "There is no danger if they have a company ID"],
      hi: ["यह उन्हें आपके फोन और OTPs का पूरा लाइव एक्सेस और नियंत्रण दे देता है", "यह केवल आपका मोबाइल डेटा इस्तेमाल करता है", "कंपनी ID होने पर कोई खतरा नहीं है"],
      mr: ["यामुळे त्यांना तुमच्या फोनचा आणि येणाऱ्या OTP चा पूर्ण ताबा मिळतो", "याने फक्त तुमचा मोबाइल डेटा संपतो", "कंपनी ओळखपत्र असल्यास काही धोका नाही"],
    },
    answer: 0,
    why: {
      en: "Screen-sharing apps let scammers view your bank screen, read OTPs, and steal your funds in real time.",
      hi: "स्क्रीन-शेयरिंग ऐप से धोखेबाज आपकी स्क्रीन देख सकते हैं, OTP पढ़ सकते हैं और पैसे चुरा सकते हैं।",
      mr: "स्क्रीन-शेअरिंग अॅपमुळे भामटे तुमचे OTP थेट पाहू शकतात आणि खात्यातील पैसे लंपास करू शकतात.",
    },
  },
  {
    q: {
      en: "You receive a message offering ₹3,000/day for liking YouTube videos, but they demand ₹1,000 upfront for 'VIP tasks'. This is:",
      hi: "YouTube वीडियो लाइक करके रोज़ ₹3,000 कमाने का ऑफर आता है, पर 'VIP टास्क' के लिए पहले ₹1,000 जमा करने को कहा जाता है। यह है:",
      mr: "YouTube व्हिडिओ लाइक करून रोज ₹3,000 मिळवण्याची ऑफर येते, पण 'VIP टास्क'साठी आधी ₹1,000 भरायला सांगतात. हे आहे:",
    },
    options: {
      en: ["A genuine freelance opportunity", "A task-based Ponzi / investment scam", "A special bonus offer from YouTube"],
      hi: ["एक असली फ्रीलांस काम", "टास्क आधारित निवेश घोटाला (Task Scam)", "YouTube की तरफ से विशेष बोनस"],
      mr: ["एक खरे फ्रीलान्स काम", "टास्क आधारित गुंतवणूक घोटाळा (Task Scam)", "YouTube कडून विशेष बोनस"],
    },
    answer: 1,
    why: {
      en: "Legitimate jobs never ask candidates to pay money to receive earnings. They lure you with small payouts then steal large amounts.",
      hi: "सच्ची नौकरियां कभी पैसे कमाने के लिए पैसे जमा करने को नहीं कहतीं। यह आम ऑनलाइन फ्रॉड है।",
      mr: "खरे काम मिळवण्यासाठी कधीही आधी पैसे भरावे लागत नाहीत. थोडे पैसे देऊन नंतर मोठी फसवणूक केली जाते.",
    },
  },
  {
    q: {
      en: "An SMS says: 'Your power supply will be cut tonight at 9:30 PM due to unpaid bill. Call officer at 98765xxxxx'. What should you do?",
      hi: "SMS आता है: 'बिल न भरने से आज रात 9:30 बजे बिजली काट दी जाएगी। अधिकारी से 98765xxxxx पर बात करें।' क्या करें?",
      mr: "SMS येतो: 'बिल न भरल्यामुळे आज रात्री 9:30 वाजता वीज कापली जाईल. 98765xxxxx वर संपर्क करा.' काय करावे?",
    },
    options: {
      en: ["Call the 10-digit number and pay via their link", "Ignore the personal number and verify bill on official electricity board app/office", "Forward the message to family"],
      hi: ["उस 10-अंकों वाले नंबर पर कॉल करके उनके लिंक से भुगतान करें", "संदेश नजरअंदाज करें और बिजली बोर्ड के आधिकारिक ऐप/कार्यालय से बिल जांचें", "परिवार को फॉरवर्ड करें"],
      mr: ["त्या 10-अंकी क्रमांकावर फोन करून त्यांनी दिलेल्या लिंकने पैसे भरा", "तो वैयक्तिक क्रमांक दुर्लक्षित करा व वीज मंडळाच्या अधिकृत अॅपवरून खात्री करा", "कुटुंबाला फॉरवर्ड करा"],
    },
    answer: 1,
    why: {
      en: "Electricity departments send official SMS with consumer ID, never threats from random 10-digit personal phone numbers.",
      hi: "बिजली विभाग व्यक्तिगत 10-अंकों के मोबाइल नंबर से तत्काल बिजली काटने की धमकी नहीं देता।",
      mr: "वीज मंडळ कधीही अनोळखी 10-अंकी वैयक्तिक मोबाइल क्रमांकावरून वीज कापण्याची धमकी देत नाही.",
    },
  },
  {
    q: {
      en: "An unverified instant loan app on social media asks for full access to your contacts and photo gallery. Should you allow it?",
      hi: "सोशल मीडिया पर एक अनजान इंस्टेंट लोन ऐप आपके संपर्कों (Contacts) और फोटो गैलरी की पूरी अनुमति मांगता है। क्या अनुमति देनी चाहिए?",
      mr: "सोशल मीडियावरील एक अनोळखी इन्स्टंट लोन अॅप तुमच्या संपर्कांची (Contacts) आणि फोटो गॅलरीची परवानगी मागतो. परवानगी द्यावी का?",
    },
    options: {
      en: ["Yes, to get fast loan approval", "No — predatory loan apps misuse contacts and photos to harass and blackmail victims", "Yes, but delete contacts later"],
      hi: ["हाँ, तुरंत लोन मिलने के लिए", "नहीं — अवैध लोन ऐप संपर्कों और तस्वीरों का इस्तेमाल ब्लैकमेल व उत्पीड़न के लिए करते हैं", "हाँ, बाद में संपर्क हटा देंगे"],
      mr: ["होय, लगेच कर्ज मिळवण्यासाठी", "नाही — बेकायदेशीर लोन अॅप्स संपर्क व फोटोंचा वापर नातेवाईकांना ब्लॅकमेल व त्रास देण्यासाठी करतात", "होय, पण नंतर संपर्क काढून टाकीन"],
    },
    answer: 1,
    why: {
      en: "RBI-approved banks never ask for personal gallery access or blackmail borrowers using their contact list.",
      hi: "RBI अधिकृत बैंक कभी व्यक्तिगत गैलरी का एक्सेस नहीं मांगते और न ही संपर्कों को ब्लैकमेल करते हैं।",
      mr: "RBI मान्यताप्राप्त बँका कधीही गॅलरीचा ताबा मागत नाहीत किंवा नातेवाईकांना ब्लॅकमेल करत नाहीत.",
    },
  },
  {
    q: {
      en: "You are at a railway station and connect to free open public Wi-Fi. Which activity is safest to avoid?",
      hi: "आप रेलवे स्टेशन पर फ्री पब्लिक Wi-Fi से जुड़े हैं। किस गतिविधि से बचना सबसे सुरक्षित है?",
      mr: "तुम्ही रेल्वे स्टेशनवरील मोफत पब्लिक Wi-Fi ला कनेक्ट आहात. कोणती गोष्ट टाळणे सर्वात सुरक्षित ठरेल?",
    },
    options: {
      en: ["Checking train timetable", "Reading news articles", "Logging into bank accounts or entering credit card details"],
      hi: ["ट्रेन का समय देखना", "समाचार पढ़ना", "बैंक खाते में लॉगिन करना या क्रेडिट कार्ड की जानकारी डालना"],
      mr: ["गाडीची वेळ पाहणे", "बातम्या वाचणे", "बँक खात्यात लॉगिन करणे किंवा क्रेडिट कार्ड तपशील भरणे"],
    },
    answer: 2,
    why: {
      en: "Unsecured public Wi-Fi can be monitored by attackers to intercept passwords, session cookies, and financial credentials.",
      hi: "असुरक्षित पब्लिक Wi-Fi पर हैकर्स पासवर्ड और बैंकिंग जानकारी चुरा सकते हैं।",
      mr: "असुरक्षित पब्लिक Wi-Fi वर सायबर गुन्हेगार तुमचे पासवर्ड आणि बँकिंग माहिती चोरू शकतात.",
    },
  },
];
