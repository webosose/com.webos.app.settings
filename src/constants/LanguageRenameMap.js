import $L from '@enact/i18n/$L';

// const country = typeof window === 'object' ? JSON.parse(window.PalmSystem.country).country : '';
const country = '';

export function LanguageRenameMap (str) {
	switch (str) {
		case 'alpha3' :
			return {
				'eng' : $L('English'), 'fre' : $L('French'), 'deu' : $L('German'),
				'spa' : $L('Spanish'), 'ita' : $L('Italian'), 'dut' : $L('Dutch'),
				'gre' : $L('Greek'), 'por' : $L('Portuguese'), 'swe' : $L('Swedish'),
				'nor' : $L('Norwegian'), 'dan' : $L('Danish'), 'pol' : $L('Polish'),
				'fin' : $L('Finnish'), 'ces' : $L('Czech'), 'hun' : $L('Hungarian'),
				'rus' : $L('Russian'), 'slv' : $L('Slovenian'), 'ron' : $L('Romanian'),
				'srp' : $L('Serbian'), 'scr' : $L('Croatian'), 'bul' : $L('Bulgarian'),
				'tur' : $L('Turkish'), 'cym' : $L('Welsh'), 'gla' : $L('Gaelic'),
				'mao' : $L('Maori'), 'kor' : $L('Korean'), 'jpn' : $L('Japanese'),
				'hin' : $L('Hindi'), 'cat' : $L('Catalan'), 'glg' : $L('Galician'),
				'baq' : $L('Basque'), 'chi' : $L('Chinese'), 'alb' : $L('Albanian'),
				'bos' : $L('Bosnian'), 'est' : $L('Estonian'), 'kaz' : $L('Kazakh'),
				'lit' : $L('Lithuanian'), 'mkd' : $L('Macedonian'), 'slo' : $L('Slovak'),
				'ukr' : $L('Ukrainian'), 'lav' : $L('Latvian'), 'gle' : $L('Irish'),
				'ara' : $L('Arabic'), 'heb': $L('Hebrew'), 'ind': $L('Indonesian'),
				'vie' : $L('Vietnamese'), 'yue': $L('Cantonese'), 'cmn': $L('Mandarin'),
				'per' : $L('Persian'), 'may' : $L('Malay'), 'tha' : $L('Thai'),
				'ben': $L('Bengali'), 'tel': $L('Telugu'), 'mar' : $L('Marathi'),
				'tam': $L('Tamil'), 'urd': $L('Urdu'), 'guj' : $L('Gujarati'),
				'kan': $L('Kannada'), 'mal': $L('Malayalam'), 'pan' : $L('Panjabi'),
				'asm': $L('Assamese'), 'und': $L('Undefined'), 'ger' : $L('German'),
				'eus': $L('Basque'), 'val': $L('Valencian'), 'uz' : $L('Uzbek'),
				'mul' : $L('Multiple'), 'qaa' : $L('Local'), 'mac' : $L('Macedonian'),
				'aka': $L('Akan'), 'ewe' : $L('Ewe'), 'gaa': $L('Ga'), // i18n Akan language, Ewe language, Ga language for Ghana
				'hau': $L('Hausa'), 'dag' : $L('Dagbani'), 'xsm': $L('Kasem'), 'nzi': $L('Nzema'), // i18n Hausa language, Dagbani language, Kasem language, Nzema language for Ghana
				// $L('Undefined'), $L('Mandarin'), $L('Cantonese'), $L('Original Language')
				// $L('Chinese Traditional'), $L('Traditional Chinese'),$L('Simplified Chinese')
				'afr': $L('Afrikaans'), 'nbl': $L('Ndebele'), 'nso': $L('Sotho, Northern'),
				'sot': $L('Sotho, Southern'), 'swa': $L('Swahili'), 'ssw': $L('Swati'),
				'tso': $L('Tsonga'), 'tsn': $L('Tswana'), 'ven': $L('Venda'),
				'xho': $L('Xhosa'), 'zul': $L('Zulu')
			};
		case 'alpha2':
			return {
				'en' : $L('English'), 'fr' : $L('French'), 'de' : $L('German'),
				'es' : $L('Spanish'), 'it' : $L('Italian'), 'nl' : $L('Dutch'),
				'el' : $L('Greek'), 'pt' : $L('Portuguese'), 'sv' : $L('Swedish'),
				'no' : $L('Norwegian'), 'da' : $L('Danish'), 'pl' : $L('Polish'),
				'fi' : $L('Finnish'), 'cs' : $L('Czech'), 'hu' : $L('Hungarian'),
				'ru' : $L('Russian'), 'sl' : $L('Slovenian'), 'ro' : $L('Romanian'),
				'sr' : $L('Serbian'), 'hr' : $L('Croatian'), 'bg' : $L('Bulgarian'),
				'tr' : $L('Turkish'), 'cy' : $L('Welsh'), 'gd' : $L('Gaelic'),
				'mi' : $L('Maori'), 'ko' : $L('Korean'), 'ja' : $L('Japanese'),
				'hi' : $L('Hindi'), 'ca' : $L('Catalan'), 'gl' : $L('Galician'),
				'eu' : $L('Basque'), 'zh' : $L('Chinese'), 'sq' : $L('Albanian'),
				'bs' : $L('Bosnian'), 'et' : $L('Estonian'), 'kk' : $L('Kazakh'),
				'lt' : $L('Lithuanian'), 'mk' : $L('Macedonian'), 'sk' : $L('Slovak'),
				'uk' : $L('Ukrainian'), 'lv' : $L('Latvian'), 'ga' : $L('Irish'),
				'ar' : $L('Arabic'), 'he': $L('Hebrew'), 'id': $L('Indonesian'),
				'vi' : $L('Vietnamese'), 'yue': $L('Cantonese'), 'cmn': $L('Mandarin'),
				'fa' : $L('Persian'), 'ms' : $L('Malay'), 'th' : $L('Thai'),
				'bn': $L('Bengali'), 'te': $L('Telugu'), 'mr' : $L('Marathi'),
				'ta': $L('Tamil'), 'ur': $L('Urdu'), 'gu' : $L('Gujarati'),
				'kn': $L('Kannada'), 'ml': $L('Malayalam'), 'pa' : $L('Panjabi'),
				'as': $L('Assamese'), 'nb' : $L('Norwegian'), 'uz': $L('Uzbek'),
				'mul': country === 'HUN' ? $L('Original Language') : $L('Multiple'),
				'qaa': country === 'HUN' ? $L('Local Language') : $L('Original Language'),
				'ak': $L('Akan'), 'ee' : $L('Ewe'), 'gaa': $L('Ga'), // i18n Akan language, Ewe language, Ga language for Ghana
				'ha': $L('Hausa'), 'dag' : $L('Dagbani'), 'xsm': $L('Kasem'), 'nzi': $L('Nzema'), // i18n Hausa language, Dagbani language, Kasem language, Nzema language for Ghana
				'qab': $L('Second Language'), 'qac': $L('Third Language'),
				// $L('Undefined'), $L('Mandarin'), $L('Cantonese'), $L('Original Language')
				// $L('Chinese Traditional'), $L('Traditional Chinese'),$L('Simplified Chinese')
				'af': $L('Afrikaans'), 'nr': $L('Ndebele'), 'nso': $L('Sotho, Northern'),
				'st': $L('Sotho, Southern'), 'sw': $L('Swahili'), 'ss': $L('Swati'),
				'ts': $L('Tsonga'), 'tn': $L('Tswana'), 've': $L('Venda'),
				'xh': $L('Xhosa'), 'zu': $L('Zulu')
			};
	}
}
