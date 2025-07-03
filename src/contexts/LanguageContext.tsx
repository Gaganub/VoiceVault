import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'ko' | 'pt' | 'ru' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatDate: (date: Date) => string;
  formatNumber: (number: number) => string;
  formatCurrency: (amount: number, currency?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation dictionaries
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.memories': 'Memories',
    'nav.record': 'Record',
    'nav.insights': 'Insights',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.signOut': 'Sign Out',
    
    // Landing Page
    'landing.title': 'Your Memories, Forever Secured',
    'landing.subtitle': 'Enter the future of memory preservation. Powered by quantum AI, secured by blockchain, and enhanced with neural voice synthesis.',
    'landing.enterVault': 'Enter the Vault',
    'landing.demo': 'Experience Demo',
    
    // Memory Management
    'memory.title': 'Memory Title',
    'memory.content': 'Content',
    'memory.tags': 'Tags',
    'memory.mood': 'Mood',
    'memory.private': 'Private Memory',
    'memory.save': 'Save Memory',
    'memory.edit': 'Edit Memory',
    'memory.share': 'Share Memory',
    'memory.delete': 'Delete Memory',
    'memory.cancel': 'Cancel',
    'memory.recording': 'Recording...',
    'memory.tapToRecord': 'Tap to record',
    'memory.processing': 'Processing...',
    
    // Moods
    'mood.happy': 'Happy',
    'mood.sad': 'Sad',
    'mood.neutral': 'Neutral',
    'mood.excited': 'Excited',
    'mood.reflective': 'Reflective',
    
    // Audio Player
    'audio.play': 'Play',
    'audio.pause': 'Pause',
    'audio.volume': 'Volume',
    'audio.mute': 'Mute',
    'audio.skipBack': 'Skip Back 10s',
    'audio.skipForward': 'Skip Forward 10s',
    
    // Settings
    'settings.title': 'Settings',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy & Security',
    'settings.language': 'Language & Region',
    'settings.subscription': 'Subscription',
    'settings.export': 'Export Data',
    
    // Profile
    'profile.title': 'Profile',
    'profile.fullName': 'Full Name',
    'profile.email': 'Email Address',
    'profile.memberSince': 'Member Since',
    'profile.editProfile': 'Edit Profile',
    'profile.save': 'Save',
    'profile.upgradeToPremiun': 'Upgrade to Premium',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.confirm': 'Confirm',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.date': 'Date',
    'common.title': 'Title',
    'common.all': 'All',
    'common.none': 'None',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Time
    'time.now': 'now',
    'time.minute': 'minute',
    'time.minutes': 'minutes',
    'time.hour': 'hour',
    'time.hours': 'hours',
    'time.day': 'day',
    'time.days': 'days',
    'time.week': 'week',
    'time.weeks': 'weeks',
    'time.month': 'month',
    'time.months': 'months',
    'time.year': 'year',
    'time.years': 'years',
  },
  es: {
    // Navigation
    'nav.memories': 'Recuerdos',
    'nav.record': 'Grabar',
    'nav.insights': 'Perspectivas',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configuración',
    'nav.signOut': 'Cerrar Sesión',
    
    // Landing Page
    'landing.title': 'Tus Recuerdos, Seguros Para Siempre',
    'landing.subtitle': 'Entra al futuro de la preservación de recuerdos. Impulsado por IA cuántica, asegurado por blockchain y mejorado con síntesis de voz neural.',
    'landing.enterVault': 'Entrar a la Bóveda',
    'landing.demo': 'Experimentar Demo',
    
    // Memory Management
    'memory.title': 'Título del Recuerdo',
    'memory.content': 'Contenido',
    'memory.tags': 'Etiquetas',
    'memory.mood': 'Estado de Ánimo',
    'memory.private': 'Recuerdo Privado',
    'memory.save': 'Guardar Recuerdo',
    'memory.edit': 'Editar Recuerdo',
    'memory.share': 'Compartir Recuerdo',
    'memory.delete': 'Eliminar Recuerdo',
    'memory.cancel': 'Cancelar',
    'memory.recording': 'Grabando...',
    'memory.tapToRecord': 'Toca para grabar',
    'memory.processing': 'Procesando...',
    
    // Moods
    'mood.happy': 'Feliz',
    'mood.sad': 'Triste',
    'mood.neutral': 'Neutral',
    'mood.excited': 'Emocionado',
    'mood.reflective': 'Reflexivo',
    
    // Audio Player
    'audio.play': 'Reproducir',
    'audio.pause': 'Pausar',
    'audio.volume': 'Volumen',
    'audio.mute': 'Silenciar',
    'audio.skipBack': 'Retroceder 10s',
    'audio.skipForward': 'Avanzar 10s',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.appearance': 'Apariencia',
    'settings.notifications': 'Notificaciones',
    'settings.privacy': 'Privacidad y Seguridad',
    'settings.language': 'Idioma y Región',
    'settings.subscription': 'Suscripción',
    'settings.export': 'Exportar Datos',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.fullName': 'Nombre Completo',
    'profile.email': 'Dirección de Correo',
    'profile.memberSince': 'Miembro Desde',
    'profile.editProfile': 'Editar Perfil',
    'profile.save': 'Guardar',
    'profile.upgradeToPremiun': 'Actualizar a Premium',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.confirm': 'Confirmar',
    'common.close': 'Cerrar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.date': 'Fecha',
    'common.title': 'Título',
    'common.all': 'Todos',
    'common.none': 'Ninguno',
    'common.yes': 'Sí',
    'common.no': 'No',
    
    // Time
    'time.now': 'ahora',
    'time.minute': 'minuto',
    'time.minutes': 'minutos',
    'time.hour': 'hora',
    'time.hours': 'horas',
    'time.day': 'día',
    'time.days': 'días',
    'time.week': 'semana',
    'time.weeks': 'semanas',
    'time.month': 'mes',
    'time.months': 'meses',
    'time.year': 'año',
    'time.years': 'años',
  },
  fr: {
    // Navigation
    'nav.memories': 'Souvenirs',
    'nav.record': 'Enregistrer',
    'nav.insights': 'Aperçus',
    'nav.profile': 'Profil',
    'nav.settings': 'Paramètres',
    'nav.signOut': 'Se Déconnecter',
    
    // Landing Page
    'landing.title': 'Vos Souvenirs, Sécurisés à Jamais',
    'landing.subtitle': 'Entrez dans le futur de la préservation des souvenirs. Alimenté par l\'IA quantique, sécurisé par blockchain et amélioré avec la synthèse vocale neurale.',
    'landing.enterVault': 'Entrer dans le Coffre',
    'landing.demo': 'Expérimenter la Démo',
    
    // Memory Management
    'memory.title': 'Titre du Souvenir',
    'memory.content': 'Contenu',
    'memory.tags': 'Étiquettes',
    'memory.mood': 'Humeur',
    'memory.private': 'Souvenir Privé',
    'memory.save': 'Sauvegarder le Souvenir',
    'memory.edit': 'Modifier le Souvenir',
    'memory.share': 'Partager le Souvenir',
    'memory.delete': 'Supprimer le Souvenir',
    'memory.cancel': 'Annuler',
    'memory.recording': 'Enregistrement...',
    'memory.tapToRecord': 'Appuyez pour enregistrer',
    'memory.processing': 'Traitement...',
    
    // Moods
    'mood.happy': 'Heureux',
    'mood.sad': 'Triste',
    'mood.neutral': 'Neutre',
    'mood.excited': 'Excité',
    'mood.reflective': 'Réfléchi',
    
    // Audio Player
    'audio.play': 'Lire',
    'audio.pause': 'Pause',
    'audio.volume': 'Volume',
    'audio.mute': 'Muet',
    'audio.skipBack': 'Reculer 10s',
    'audio.skipForward': 'Avancer 10s',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.appearance': 'Apparence',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Confidentialité et Sécurité',
    'settings.language': 'Langue et Région',
    'settings.subscription': 'Abonnement',
    'settings.export': 'Exporter les Données',
    
    // Profile
    'profile.title': 'Profil',
    'profile.fullName': 'Nom Complet',
    'profile.email': 'Adresse E-mail',
    'profile.memberSince': 'Membre Depuis',
    'profile.editProfile': 'Modifier le Profil',
    'profile.save': 'Sauvegarder',
    'profile.upgradeToPremiun': 'Passer à Premium',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.confirm': 'Confirmer',
    'common.close': 'Fermer',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.sort': 'Trier',
    'common.date': 'Date',
    'common.title': 'Titre',
    'common.all': 'Tous',
    'common.none': 'Aucun',
    'common.yes': 'Oui',
    'common.no': 'Non',
    
    // Time
    'time.now': 'maintenant',
    'time.minute': 'minute',
    'time.minutes': 'minutes',
    'time.hour': 'heure',
    'time.hours': 'heures',
    'time.day': 'jour',
    'time.days': 'jours',
    'time.week': 'semaine',
    'time.weeks': 'semaines',
    'time.month': 'mois',
    'time.months': 'mois',
    'time.year': 'année',
    'time.years': 'années',
  },
  de: {
    // Navigation
    'nav.memories': 'Erinnerungen',
    'nav.record': 'Aufnehmen',
    'nav.insights': 'Einblicke',
    'nav.profile': 'Profil',
    'nav.settings': 'Einstellungen',
    'nav.signOut': 'Abmelden',
    
    // Landing Page
    'landing.title': 'Ihre Erinnerungen, Für Immer Gesichert',
    'landing.subtitle': 'Betreten Sie die Zukunft der Erinnerungsbewahrung. Angetrieben von Quanten-KI, gesichert durch Blockchain und verbessert mit neuraler Sprachsynthese.',
    'landing.enterVault': 'Tresor Betreten',
    'landing.demo': 'Demo Erleben',
    
    // Memory Management
    'memory.title': 'Erinnerungstitel',
    'memory.content': 'Inhalt',
    'memory.tags': 'Tags',
    'memory.mood': 'Stimmung',
    'memory.private': 'Private Erinnerung',
    'memory.save': 'Erinnerung Speichern',
    'memory.edit': 'Erinnerung Bearbeiten',
    'memory.share': 'Erinnerung Teilen',
    'memory.delete': 'Erinnerung Löschen',
    'memory.cancel': 'Abbrechen',
    'memory.recording': 'Aufnahme...',
    'memory.tapToRecord': 'Zum Aufnehmen tippen',
    'memory.processing': 'Verarbeitung...',
    
    // Moods
    'mood.happy': 'Glücklich',
    'mood.sad': 'Traurig',
    'mood.neutral': 'Neutral',
    'mood.excited': 'Aufgeregt',
    'mood.reflective': 'Nachdenklich',
    
    // Audio Player
    'audio.play': 'Abspielen',
    'audio.pause': 'Pause',
    'audio.volume': 'Lautstärke',
    'audio.mute': 'Stumm',
    'audio.skipBack': '10s Zurück',
    'audio.skipForward': '10s Vor',
    
    // Settings
    'settings.title': 'Einstellungen',
    'settings.appearance': 'Erscheinungsbild',
    'settings.notifications': 'Benachrichtigungen',
    'settings.privacy': 'Datenschutz & Sicherheit',
    'settings.language': 'Sprache & Region',
    'settings.subscription': 'Abonnement',
    'settings.export': 'Daten Exportieren',
    
    // Profile
    'profile.title': 'Profil',
    'profile.fullName': 'Vollständiger Name',
    'profile.email': 'E-Mail-Adresse',
    'profile.memberSince': 'Mitglied Seit',
    'profile.editProfile': 'Profil Bearbeiten',
    'profile.save': 'Speichern',
    'profile.upgradeToPremiun': 'Auf Premium Upgraden',
    
    // Common
    'common.loading': 'Laden...',
    'common.error': 'Fehler',
    'common.success': 'Erfolg',
    'common.confirm': 'Bestätigen',
    'common.close': 'Schließen',
    'common.search': 'Suchen',
    'common.filter': 'Filtern',
    'common.sort': 'Sortieren',
    'common.date': 'Datum',
    'common.title': 'Titel',
    'common.all': 'Alle',
    'common.none': 'Keine',
    'common.yes': 'Ja',
    'common.no': 'Nein',
    
    // Time
    'time.now': 'jetzt',
    'time.minute': 'Minute',
    'time.minutes': 'Minuten',
    'time.hour': 'Stunde',
    'time.hours': 'Stunden',
    'time.day': 'Tag',
    'time.days': 'Tage',
    'time.week': 'Woche',
    'time.weeks': 'Wochen',
    'time.month': 'Monat',
    'time.months': 'Monate',
    'time.year': 'Jahr',
    'time.years': 'Jahre',
  },
  ja: {
    // Navigation
    'nav.memories': '思い出',
    'nav.record': '録音',
    'nav.insights': '洞察',
    'nav.profile': 'プロフィール',
    'nav.settings': '設定',
    'nav.signOut': 'サインアウト',
    
    // Landing Page
    'landing.title': 'あなたの思い出、永遠に保護',
    'landing.subtitle': '記憶保存の未来へ。量子AIによって駆動され、ブロックチェーンによって保護され、ニューラル音声合成によって強化されています。',
    'landing.enterVault': 'ボルトに入る',
    'landing.demo': 'デモを体験',
    
    // Memory Management
    'memory.title': '思い出のタイトル',
    'memory.content': '内容',
    'memory.tags': 'タグ',
    'memory.mood': '気分',
    'memory.private': 'プライベートな思い出',
    'memory.save': '思い出を保存',
    'memory.edit': '思い出を編集',
    'memory.share': '思い出を共有',
    'memory.delete': '思い出を削除',
    'memory.cancel': 'キャンセル',
    'memory.recording': '録音中...',
    'memory.tapToRecord': 'タップして録音',
    'memory.processing': '処理中...',
    
    // Moods
    'mood.happy': '幸せ',
    'mood.sad': '悲しい',
    'mood.neutral': '中立',
    'mood.excited': '興奮',
    'mood.reflective': '反省的',
    
    // Audio Player
    'audio.play': '再生',
    'audio.pause': '一時停止',
    'audio.volume': '音量',
    'audio.mute': 'ミュート',
    'audio.skipBack': '10秒戻る',
    'audio.skipForward': '10秒進む',
    
    // Settings
    'settings.title': '設定',
    'settings.appearance': '外観',
    'settings.notifications': '通知',
    'settings.privacy': 'プライバシーとセキュリティ',
    'settings.language': '言語と地域',
    'settings.subscription': 'サブスクリプション',
    'settings.export': 'データをエクスポート',
    
    // Profile
    'profile.title': 'プロフィール',
    'profile.fullName': 'フルネーム',
    'profile.email': 'メールアドレス',
    'profile.memberSince': 'メンバー歴',
    'profile.editProfile': 'プロフィールを編集',
    'profile.save': '保存',
    'profile.upgradeToPremiun': 'プレミアムにアップグレード',
    
    // Common
    'common.loading': '読み込み中...',
    'common.error': 'エラー',
    'common.success': '成功',
    'common.confirm': '確認',
    'common.close': '閉じる',
    'common.search': '検索',
    'common.filter': 'フィルター',
    'common.sort': 'ソート',
    'common.date': '日付',
    'common.title': 'タイトル',
    'common.all': 'すべて',
    'common.none': 'なし',
    'common.yes': 'はい',
    'common.no': 'いいえ',
    
    // Time
    'time.now': '今',
    'time.minute': '分',
    'time.minutes': '分',
    'time.hour': '時間',
    'time.hours': '時間',
    'time.day': '日',
    'time.days': '日',
    'time.week': '週',
    'time.weeks': '週',
    'time.month': '月',
    'time.months': '月',
    'time.year': '年',
    'time.years': '年',
  },
  zh: {
    // Navigation
    'nav.memories': '回忆',
    'nav.record': '录制',
    'nav.insights': '洞察',
    'nav.profile': '个人资料',
    'nav.settings': '设置',
    'nav.signOut': '退出登录',
    
    // Landing Page
    'landing.title': '您的回忆，永远安全',
    'landing.subtitle': '进入记忆保存的未来。由量子AI驱动，区块链保护，神经语音合成增强。',
    'landing.enterVault': '进入保险库',
    'landing.demo': '体验演示',
    
    // Memory Management
    'memory.title': '回忆标题',
    'memory.content': '内容',
    'memory.tags': '标签',
    'memory.mood': '心情',
    'memory.private': '私人回忆',
    'memory.save': '保存回忆',
    'memory.edit': '编辑回忆',
    'memory.share': '分享回忆',
    'memory.delete': '删除回忆',
    'memory.cancel': '取消',
    'memory.recording': '录制中...',
    'memory.tapToRecord': '点击录制',
    'memory.processing': '处理中...',
    
    // Moods
    'mood.happy': '快乐',
    'mood.sad': '悲伤',
    'mood.neutral': '中性',
    'mood.excited': '兴奋',
    'mood.reflective': '反思',
    
    // Audio Player
    'audio.play': '播放',
    'audio.pause': '暂停',
    'audio.volume': '音量',
    'audio.mute': '静音',
    'audio.skipBack': '后退10秒',
    'audio.skipForward': '前进10秒',
    
    // Settings
    'settings.title': '设置',
    'settings.appearance': '外观',
    'settings.notifications': '通知',
    'settings.privacy': '隐私和安全',
    'settings.language': '语言和地区',
    'settings.subscription': '订阅',
    'settings.export': '导出数据',
    
    // Profile
    'profile.title': '个人资料',
    'profile.fullName': '全名',
    'profile.email': '电子邮件地址',
    'profile.memberSince': '会员自',
    'profile.editProfile': '编辑个人资料',
    'profile.save': '保存',
    'profile.upgradeToPremiun': '升级到高级版',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '错误',
    'common.success': '成功',
    'common.confirm': '确认',
    'common.close': '关闭',
    'common.search': '搜索',
    'common.filter': '筛选',
    'common.sort': '排序',
    'common.date': '日期',
    'common.title': '标题',
    'common.all': '全部',
    'common.none': '无',
    'common.yes': '是',
    'common.no': '否',
    
    // Time
    'time.now': '现在',
    'time.minute': '分钟',
    'time.minutes': '分钟',
    'time.hour': '小时',
    'time.hours': '小时',
    'time.day': '天',
    'time.days': '天',
    'time.week': '周',
    'time.weeks': '周',
    'time.month': '月',
    'time.months': '月',
    'time.year': '年',
    'time.years': '年',
  },
  ko: {
    // Navigation
    'nav.memories': '추억',
    'nav.record': '녹음',
    'nav.insights': '통찰',
    'nav.profile': '프로필',
    'nav.settings': '설정',
    'nav.signOut': '로그아웃',
    
    // Landing Page
    'landing.title': '당신의 추억, 영원히 보호',
    'landing.subtitle': '기억 보존의 미래로 들어가세요. 양자 AI로 구동되고, 블록체인으로 보호되며, 신경 음성 합성으로 향상됩니다.',
    'landing.enterVault': '볼트 입장',
    'landing.demo': '데모 체험',
    
    // Memory Management
    'memory.title': '추억 제목',
    'memory.content': '내용',
    'memory.tags': '태그',
    'memory.mood': '기분',
    'memory.private': '개인 추억',
    'memory.save': '추억 저장',
    'memory.edit': '추억 편집',
    'memory.share': '추억 공유',
    'memory.delete': '추억 삭제',
    'memory.cancel': '취소',
    'memory.recording': '녹음 중...',
    'memory.tapToRecord': '녹음하려면 탭',
    'memory.processing': '처리 중...',
    
    // Moods
    'mood.happy': '행복',
    'mood.sad': '슬픔',
    'mood.neutral': '중립',
    'mood.excited': '흥분',
    'mood.reflective': '성찰적',
    
    // Audio Player
    'audio.play': '재생',
    'audio.pause': '일시정지',
    'audio.volume': '볼륨',
    'audio.mute': '음소거',
    'audio.skipBack': '10초 뒤로',
    'audio.skipForward': '10초 앞으로',
    
    // Settings
    'settings.title': '설정',
    'settings.appearance': '외관',
    'settings.notifications': '알림',
    'settings.privacy': '개인정보 및 보안',
    'settings.language': '언어 및 지역',
    'settings.subscription': '구독',
    'settings.export': '데이터 내보내기',
    
    // Profile
    'profile.title': '프로필',
    'profile.fullName': '전체 이름',
    'profile.email': '이메일 주소',
    'profile.memberSince': '가입일',
    'profile.editProfile': '프로필 편집',
    'profile.save': '저장',
    'profile.upgradeToPremiun': '프리미엄으로 업그레이드',
    
    // Common
    'common.loading': '로딩 중...',
    'common.error': '오류',
    'common.success': '성공',
    'common.confirm': '확인',
    'common.close': '닫기',
    'common.search': '검색',
    'common.filter': '필터',
    'common.sort': '정렬',
    'common.date': '날짜',
    'common.title': '제목',
    'common.all': '전체',
    'common.none': '없음',
    'common.yes': '예',
    'common.no': '아니오',
    
    // Time
    'time.now': '지금',
    'time.minute': '분',
    'time.minutes': '분',
    'time.hour': '시간',
    'time.hours': '시간',
    'time.day': '일',
    'time.days': '일',
    'time.week': '주',
    'time.weeks': '주',
    'time.month': '월',
    'time.months': '월',
    'time.year': '년',
    'time.years': '년',
  },
  pt: {
    // Navigation
    'nav.memories': 'Memórias',
    'nav.record': 'Gravar',
    'nav.insights': 'Insights',
    'nav.profile': 'Perfil',
    'nav.settings': 'Configurações',
    'nav.signOut': 'Sair',
    
    // Landing Page
    'landing.title': 'Suas Memórias, Seguras Para Sempre',
    'landing.subtitle': 'Entre no futuro da preservação de memórias. Alimentado por IA quântica, protegido por blockchain e aprimorado com síntese de voz neural.',
    'landing.enterVault': 'Entrar no Cofre',
    'landing.demo': 'Experimentar Demo',
    
    // Memory Management
    'memory.title': 'Título da Memória',
    'memory.content': 'Conteúdo',
    'memory.tags': 'Tags',
    'memory.mood': 'Humor',
    'memory.private': 'Memória Privada',
    'memory.save': 'Salvar Memória',
    'memory.edit': 'Editar Memória',
    'memory.share': 'Compartilhar Memória',
    'memory.delete': 'Excluir Memória',
    'memory.cancel': 'Cancelar',
    'memory.recording': 'Gravando...',
    'memory.tapToRecord': 'Toque para gravar',
    'memory.processing': 'Processando...',
    
    // Moods
    'mood.happy': 'Feliz',
    'mood.sad': 'Triste',
    'mood.neutral': 'Neutro',
    'mood.excited': 'Animado',
    'mood.reflective': 'Reflexivo',
    
    // Audio Player
    'audio.play': 'Reproduzir',
    'audio.pause': 'Pausar',
    'audio.volume': 'Volume',
    'audio.mute': 'Silenciar',
    'audio.skipBack': 'Voltar 10s',
    'audio.skipForward': 'Avançar 10s',
    
    // Settings
    'settings.title': 'Configurações',
    'settings.appearance': 'Aparência',
    'settings.notifications': 'Notificações',
    'settings.privacy': 'Privacidade e Segurança',
    'settings.language': 'Idioma e Região',
    'settings.subscription': 'Assinatura',
    'settings.export': 'Exportar Dados',
    
    // Profile
    'profile.title': 'Perfil',
    'profile.fullName': 'Nome Completo',
    'profile.email': 'Endereço de Email',
    'profile.memberSince': 'Membro Desde',
    'profile.editProfile': 'Editar Perfil',
    'profile.save': 'Salvar',
    'profile.upgradeToPremiun': 'Atualizar para Premium',
    
    // Common
    'common.loading': 'Carregando...',
    'common.error': 'Erro',
    'common.success': 'Sucesso',
    'common.confirm': 'Confirmar',
    'common.close': 'Fechar',
    'common.search': 'Pesquisar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.date': 'Data',
    'common.title': 'Título',
    'common.all': 'Todos',
    'common.none': 'Nenhum',
    'common.yes': 'Sim',
    'common.no': 'Não',
    
    // Time
    'time.now': 'agora',
    'time.minute': 'minuto',
    'time.minutes': 'minutos',
    'time.hour': 'hora',
    'time.hours': 'horas',
    'time.day': 'dia',
    'time.days': 'dias',
    'time.week': 'semana',
    'time.weeks': 'semanas',
    'time.month': 'mês',
    'time.months': 'meses',
    'time.year': 'ano',
    'time.years': 'anos',
  },
  ru: {
    // Navigation
    'nav.memories': 'Воспоминания',
    'nav.record': 'Записать',
    'nav.insights': 'Аналитика',
    'nav.profile': 'Профиль',
    'nav.settings': 'Настройки',
    'nav.signOut': 'Выйти',
    
    // Landing Page
    'landing.title': 'Ваши Воспоминания, Навсегда Защищены',
    'landing.subtitle': 'Войдите в будущее сохранения воспоминаний. Работает на квантовом ИИ, защищено блокчейном и улучшено нейронным синтезом речи.',
    'landing.enterVault': 'Войти в Хранилище',
    'landing.demo': 'Попробовать Демо',
    
    // Memory Management
    'memory.title': 'Название Воспоминания',
    'memory.content': 'Содержание',
    'memory.tags': 'Теги',
    'memory.mood': 'Настроение',
    'memory.private': 'Личное Воспоминание',
    'memory.save': 'Сохранить Воспоминание',
    'memory.edit': 'Редактировать Воспоминание',
    'memory.share': 'Поделиться Воспоминанием',
    'memory.delete': 'Удалить Воспоминание',
    'memory.cancel': 'Отмена',
    'memory.recording': 'Запись...',
    'memory.tapToRecord': 'Нажмите для записи',
    'memory.processing': 'Обработка...',
    
    // Moods
    'mood.happy': 'Счастливый',
    'mood.sad': 'Грустный',
    'mood.neutral': 'Нейтральный',
    'mood.excited': 'Взволнованный',
    'mood.reflective': 'Задумчивый',
    
    // Audio Player
    'audio.play': 'Воспроизвести',
    'audio.pause': 'Пауза',
    'audio.volume': 'Громкость',
    'audio.mute': 'Без звука',
    'audio.skipBack': 'Назад 10с',
    'audio.skipForward': 'Вперед 10с',
    
    // Settings
    'settings.title': 'Настройки',
    'settings.appearance': 'Внешний вид',
    'settings.notifications': 'Уведомления',
    'settings.privacy': 'Конфиденциальность и Безопасность',
    'settings.language': 'Язык и Регион',
    'settings.subscription': 'Подписка',
    'settings.export': 'Экспорт Данных',
    
    // Profile
    'profile.title': 'Профиль',
    'profile.fullName': 'Полное Имя',
    'profile.email': 'Адрес Электронной Почты',
    'profile.memberSince': 'Участник С',
    'profile.editProfile': 'Редактировать Профиль',
    'profile.save': 'Сохранить',
    'profile.upgradeToPremiun': 'Обновить до Премиум',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успех',
    'common.confirm': 'Подтвердить',
    'common.close': 'Закрыть',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.sort': 'Сортировка',
    'common.date': 'Дата',
    'common.title': 'Название',
    'common.all': 'Все',
    'common.none': 'Нет',
    'common.yes': 'Да',
    'common.no': 'Нет',
    
    // Time
    'time.now': 'сейчас',
    'time.minute': 'минута',
    'time.minutes': 'минуты',
    'time.hour': 'час',
    'time.hours': 'часы',
    'time.day': 'день',
    'time.days': 'дни',
    'time.week': 'неделя',
    'time.weeks': 'недели',
    'time.month': 'месяц',
    'time.months': 'месяцы',
    'time.year': 'год',
    'time.years': 'годы',
  },
  ar: {
    // Navigation
    'nav.memories': 'الذكريات',
    'nav.record': 'تسجيل',
    'nav.insights': 'رؤى',
    'nav.profile': 'الملف الشخصي',
    'nav.settings': 'الإعدادات',
    'nav.signOut': 'تسجيل الخروج',
    
    // Landing Page
    'landing.title': 'ذكرياتك، محمية إلى الأبد',
    'landing.subtitle': 'ادخل إلى مستقبل حفظ الذكريات. مدعوم بالذكاء الاصطناعي الكمي، محمي بالبلوك تشين، ومحسن بتركيب الصوت العصبي.',
    'landing.enterVault': 'دخول الخزنة',
    'landing.demo': 'تجربة العرض التوضيحي',
    
    // Memory Management
    'memory.title': 'عنوان الذكرى',
    'memory.content': 'المحتوى',
    'memory.tags': 'العلامات',
    'memory.mood': 'المزاج',
    'memory.private': 'ذكرى خاصة',
    'memory.save': 'حفظ الذكرى',
    'memory.edit': 'تحرير الذكرى',
    'memory.share': 'مشاركة الذكرى',
    'memory.delete': 'حذف الذكرى',
    'memory.cancel': 'إلغاء',
    'memory.recording': 'جاري التسجيل...',
    'memory.tapToRecord': 'اضغط للتسجيل',
    'memory.processing': 'جاري المعالجة...',
    
    // Moods
    'mood.happy': 'سعيد',
    'mood.sad': 'حزين',
    'mood.neutral': 'محايد',
    'mood.excited': 'متحمس',
    'mood.reflective': 'متأمل',
    
    // Audio Player
    'audio.play': 'تشغيل',
    'audio.pause': 'إيقاف مؤقت',
    'audio.volume': 'الصوت',
    'audio.mute': 'كتم الصوت',
    'audio.skipBack': 'الرجوع 10 ثوان',
    'audio.skipForward': 'التقدم 10 ثوان',
    
    // Settings
    'settings.title': 'الإعدادات',
    'settings.appearance': 'المظهر',
    'settings.notifications': 'الإشعارات',
    'settings.privacy': 'الخصوصية والأمان',
    'settings.language': 'اللغة والمنطقة',
    'settings.subscription': 'الاشتراك',
    'settings.export': 'تصدير البيانات',
    
    // Profile
    'profile.title': 'الملف الشخصي',
    'profile.fullName': 'الاسم الكامل',
    'profile.email': 'عنوان البريد الإلكتروني',
    'profile.memberSince': 'عضو منذ',
    'profile.editProfile': 'تحرير الملف الشخصي',
    'profile.save': 'حفظ',
    'profile.upgradeToPremiun': 'الترقية إلى بريميوم',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.confirm': 'تأكيد',
    'common.close': 'إغلاق',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    'common.date': 'التاريخ',
    'common.title': 'العنوان',
    'common.all': 'الكل',
    'common.none': 'لا شيء',
    'common.yes': 'نعم',
    'common.no': 'لا',
    
    // Time
    'time.now': 'الآن',
    'time.minute': 'دقيقة',
    'time.minutes': 'دقائق',
    'time.hour': 'ساعة',
    'time.hours': 'ساعات',
    'time.day': 'يوم',
    'time.days': 'أيام',
    'time.week': 'أسبوع',
    'time.weeks': 'أسابيع',
    'time.month': 'شهر',
    'time.months': 'أشهر',
    'time.year': 'سنة',
    'time.years': 'سنوات',
  },
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('voicevault-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage);
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0] as Language;
      if (translations[browserLang]) {
        setLanguageState(browserLang);
      }
    }
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem('voicevault-language', newLanguage);
    
    // Update document direction for RTL languages
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key] || translations['en'][key] || key;
    
    // Replace parameters in translation
    if (params) {
      Object.entries(params).forEach(([paramKey, value]) => {
        translation = translation.replace(`{{${paramKey}}}`, String(value));
      });
    }
    
    return translation;
  };

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    return new Intl.DateTimeFormat(getLocale(language), options).format(date);
  };

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat(getLocale(language)).format(number);
  };

  const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat(getLocale(language), {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const getLocale = (lang: Language): string => {
    const localeMap: Record<Language, string> = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      ja: 'ja-JP',
      zh: 'zh-CN',
      ko: 'ko-KR',
      pt: 'pt-BR',
      ru: 'ru-RU',
      ar: 'ar-SA',
    };
    return localeMap[lang] || 'en-US';
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage,
      t,
      formatDate,
      formatNumber,
      formatCurrency,
    }}>
      {children}
    </LanguageContext.Provider>
  );
};
