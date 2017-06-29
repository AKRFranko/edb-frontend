(function(){
  if(!window.EDB) throw new Error("Missing EDB namespace.");
  var countries = {
    "CA": {
      "code": "CA",
      "name": {
        "en": "Canada",
        "fr": "Canada"
      }
    },
    "US": {
      "code": "US",
      "name": {
        "en": "United States",
        "fr": "États-Unis"
      }
    },
    "MX": {
      "code": "MX",
      "name": {
        "en": "Mexico",
        "fr": "Mexique"
      }
    },
    "AF": {
      "code": "AF",
      "name": {
        "en": "Afghanistan",
        "fr": "Afghanistan"
      }
    },
    "AX": {
      "code": "AX",
      "name": {
        "en": "Åland Islands",
        "fr": "Åland Islands"
      }
    },
    "AL": {
      "code": "AL",
      "name": {
        "en": "Albania",
        "fr": "Albanie"
      }
    },
    "DZ": {
      "code": "DZ",
      "name": {
        "en": "Algeria",
        "fr": "Algérie"
      }
    },
    "AS": {
      "code": "AS",
      "name": {
        "en": "American Samoa",
        "fr": "Samoa américaines"
      }
    },
    "AD": {
      "code": "AD",
      "name": {
        "en": "AndorrA",
        "fr": "AndorrA"
      }
    },
    "AO": {
      "code": "AO",
      "name": {
        "en": "Angola",
        "fr": "Angola"
      }
    },
    "AI": {
      "code": "AI",
      "name": {
        "en": "Anguilla",
        "fr": "Anguilla"
      }
    },
    "AQ": {
      "code": "AQ",
      "name": {
        "en": "Antarctica",
        "fr": "Antarctique"
      }
    },
    "AG": {
      "code": "AG",
      "name": {
        "en": "Antigua and Barbuda",
        "fr": "Antigua et Barbuda"
      }
    },
    "AR": {
      "code": "AR",
      "name": {
        "en": "Argentina",
        "fr": "Argentine"
      }
    },
    "AM": {
      "code": "AM",
      "name": {
        "en": "Armenia",
        "fr": "Armenia"
      }
    },
    "AW": {
      "code": "AW",
      "name": {
        "en": "Aruba",
        "fr": "Aruba"
      }
    },
    "AU": {
      "code": "AU",
      "name": {
        "en": "Australia",
        "fr": "Australie"
      }
    },
    "AT": {
      "code": "AT",
      "name": {
        "en": "Austria",
        "fr": "Autriche"
      }
    },
    "AZ": {
      "code": "AZ",
      "name": {
        "en": "Azerbaijan",
        "fr": "Azerbaïdjan"
      }
    },
    "BS": {
      "code": "BS",
      "name": {
        "en": "Bahamas",
        "fr": "Bahamas"
      }
    },
    "BH": {
      "code": "BH",
      "name": {
        "en": "Bahrain",
        "fr": "Bahreïn"
      }
    },
    "BD": {
      "code": "BD",
      "name": {
        "en": "Bangladesh",
        "fr": "Bangladesh"
      }
    },
    "BB": {
      "code": "BB",
      "name": {
        "en": "Barbados",
        "fr": "Barbados"
      }
    },
    "BY": {
      "code": "BY",
      "name": {
        "en": "Belarus",
        "fr": "Belarus"
      }
    },
    "BE": {
      "code": "BE",
      "name": {
        "en": "Belgium",
        "fr": "Belgique"
      }
    },
    "BZ": {
      "code": "BZ",
      "name": {
        "en": "Belize",
        "fr": "Belize"
      }
    },
    "BJ": {
      "code": "BJ",
      "name": {
        "en": "Benin",
        "fr": "Bénin"
      }
    },
    "BM": {
      "code": "BM",
      "name": {
        "en": "Bermuda",
        "fr": "Bermudes"
      }
    },
    "BT": {
      "code": "BT",
      "name": {
        "en": "Bhutan",
        "fr": "Bhoutan"
      }
    },
    "BO": {
      "code": "BO",
      "name": {
        "en": "Bolivia",
        "fr": "Bolivie"
      }
    },
    "BA": {
      "code": "BA",
      "name": {
        "en": "Bosnia and Herzegovina",
        "fr": "Bosnie-Herzégovine"
      }
    },
    "BW": {
      "code": "BW",
      "name": {
        "en": "Botswana",
        "fr": "Botswana"
      }
    },
    "BV": {
      "code": "BV",
      "name": {
        "en": "Bouvet Island",
        "fr": "Bouvet Island"
      }
    },
    "BR": {
      "code": "BR",
      "name": {
        "en": "Brazil",
        "fr": "Brésil"
      }
    },
    "IO": {
      "code": "IO",
      "name": {
        "en": "British Indian Ocean Territory",
        "fr": "Territoire de l'océan Indien britannique"
      }
    },
    "BN": {
      "code": "BN",
      "name": {
        "en": "Brunei Darussalam",
        "fr": "Brunei Darussalam"
      }
    },
    "BG": {
      "code": "BG",
      "name": {
        "en": "Bulgaria",
        "fr": "Bulgarie"
      }
    },
    "BF": {
      "code": "BF",
      "name": {
        "en": "Burkina Faso",
        "fr": "Burkina Faso"
      }
    },
    "BI": {
      "code": "BI",
      "name": {
        "en": "Burundi",
        "fr": "Burundi"
      }
    },
    "KH": {
      "code": "KH",
      "name": {
        "en": "Cambodia",
        "fr": "Cambodge"
      }
    },
    "CM": {
      "code": "CM",
      "name": {
        "en": "Cameroon",
        "fr": "Cameroun"
      }
    },
    
    "CV": {
      "code": "CV",
      "name": {
        "en": "Cape Verde",
        "fr": "Cap-Vert"
      }
    },
    "KY": {
      "code": "KY",
      "name": {
        "en": "Cayman Islands",
        "fr": "Îles Caïmans"
      }
    },
    "CF": {
      "code": "CF",
      "name": {
        "en": "Central African Republic",
        "fr": "République centrafricaine"
      }
    },
    "TD": {
      "code": "TD",
      "name": {
        "en": "Chad",
        "fr": "Tchad"
      }
    },
    "CL": {
      "code": "CL",
      "name": {
        "en": "Chile",
        "fr": "Chili"
      }
    },
    "CN": {
      "code": "CN",
      "name": {
        "en": "China",
        "fr": "Chine"
      }
    },
    "CX": {
      "code": "CX",
      "name": {
        "en": "Christmas Island",
        "fr": "Christmas Island"
      }
    },
    "CC": {
      "code": "CC",
      "name": {
        "en": "Cocos (Keeling) Islands",
        "fr": "Cocos (Keeling) Islands"
      }
    },
    "CO": {
      "code": "CO",
      "name": {
        "en": "Colombia",
        "fr": "Colombie"
      }
    },
    "KM": {
      "code": "KM",
      "name": {
        "en": "Comoros",
        "fr": "Comores"
      }
    },
    "CG": {
      "code": "CG",
      "name": {
        "en": "Congo",
        "fr": "Congo"
      }
    },
    "CD": {
      "code": "CD",
      "name": {
        "en": "Congo, The Democratic Republic of the",
        "fr": "Congo, République démocratique du"
      }
    },
    "CK": {
      "code": "CK",
      "name": {
        "en": "Cook Islands",
        "fr": "Cook Islands"
      }
    },
    "CR": {
      "code": "CR",
      "name": {
        "en": "Costa Rica",
        "fr": "Costa Rica"
      }
    },
    "CI": {
      "code": "CI",
      "name": {
        "en": "Cote D'Ivoire",
        "fr": "Cote D ' Ivoire"
      }
    },
    "HR": {
      "code": "HR",
      "name": {
        "en": "Croatia",
        "fr": "Croatie"
      }
    },
    "CU": {
      "code": "CU",
      "name": {
        "en": "Cuba",
        "fr": "Cuba"
      }
    },
    "CY": {
      "code": "CY",
      "name": {
        "en": "Cyprus",
        "fr": "Chypre"
      }
    },
    "CZ": {
      "code": "CZ",
      "name": {
        "en": "Czech Republic",
        "fr": "République Tchèque"
      }
    },
    "DK": {
      "code": "DK",
      "name": {
        "en": "Denmark",
        "fr": "Danemark"
      }
    },
    "DJ": {
      "code": "DJ",
      "name": {
        "en": "Djibouti",
        "fr": "Djibouti"
      }
    },
    "DM": {
      "code": "DM",
      "name": {
        "en": "Dominica",
        "fr": "Dominique"
      }
    },
    "DO": {
      "code": "DO",
      "name": {
        "en": "Dominican Republic",
        "fr": "République dominicaine"
      }
    },
    "EC": {
      "code": "EC",
      "name": {
        "en": "Ecuador",
        "fr": "Équateur"
      }
    },
    "EG": {
      "code": "EG",
      "name": {
        "en": "Egypt",
        "fr": "Egypte"
      }
    },
    "SV": {
      "code": "SV",
      "name": {
        "en": "El Salvador",
        "fr": "El Salvador"
      }
    },
    "GQ": {
      "code": "GQ",
      "name": {
        "en": "Equatorial Guinea",
        "fr": "Guinée équatoriale"
      }
    },
    "ER": {
      "code": "ER",
      "name": {
        "en": "Eritrea",
        "fr": "Érythrée"
      }
    },
    "EE": {
      "code": "EE",
      "name": {
        "en": "Estonia",
        "fr": "Estonie"
      }
    },
    "ET": {
      "code": "ET",
      "name": {
        "en": "Ethiopia",
        "fr": "Ethiopie"
      }
    },
    "FK": {
      "code": "FK",
      "name": {
        "en": "Falkland Islands (Malvinas)",
        "fr": "Falkland Islands (Malvinas)"
      }
    },
    "FO": {
      "code": "FO",
      "name": {
        "en": "Faroe Islands",
        "fr": "Îles Féroé"
      }
    },
    "FJ": {
      "code": "FJ",
      "name": {
        "en": "Fiji",
        "fr": "Fidji"
      }
    },
    "FI": {
      "code": "FI",
      "name": {
        "en": "Finland",
        "fr": "Finlande"
      }
    },
    "FR": {
      "code": "FR",
      "name": {
        "en": "France",
        "fr": "France"
      }
    },
    "GF": {
      "code": "GF",
      "name": {
        "en": "French Guiana",
        "fr": "Guyane française"
      }
    },
    "PF": {
      "code": "PF",
      "name": {
        "en": "French Polynesia",
        "fr": "Polynésie française"
      }
    },
    "TF": {
      "code": "TF",
      "name": {
        "en": "French Southern Territories",
        "fr": "Territoires du Sud français"
      }
    },
    "GA": {
      "code": "GA",
      "name": {
        "en": "Gabon",
        "fr": "Gabon"
      }
    },
    "GM": {
      "code": "GM",
      "name": {
        "en": "Gambia",
        "fr": "Gambie"
      }
    },
    "GE": {
      "code": "GE",
      "name": {
        "en": "Georgia",
        "fr": "Georgia"
      }
    },
    "DE": {
      "code": "DE",
      "name": {
        "en": "Germany",
        "fr": "Allemagne"
      }
    },
    "GH": {
      "code": "GH",
      "name": {
        "en": "Ghana",
        "fr": "Ghana"
      }
    },
    "GI": {
      "code": "GI",
      "name": {
        "en": "Gibraltar",
        "fr": "Gibraltar"
      }
    },
    "GR": {
      "code": "GR",
      "name": {
        "en": "Greece",
        "fr": "Grèce"
      }
    },
    "GL": {
      "code": "GL",
      "name": {
        "en": "Greenland",
        "fr": "Groenland"
      }
    },
    "GD": {
      "code": "GD",
      "name": {
        "en": "Grenada",
        "fr": "Grenada"
      }
    },
    "GP": {
      "code": "GP",
      "name": {
        "en": "Guadeloupe",
        "fr": "Guadeloupe"
      }
    },
    "GU": {
      "code": "GU",
      "name": {
        "en": "Guam",
        "fr": "Guam"
      }
    },
    "GT": {
      "code": "GT",
      "name": {
        "en": "Guatemala",
        "fr": "Guatemala"
      }
    },
    "GG": {
      "code": "GG",
      "name": {
        "en": "Guernsey",
        "fr": "Guernsey"
      }
    },
    "GN": {
      "code": "GN",
      "name": {
        "en": "Guinea",
        "fr": "Guinée"
      }
    },
    "GW": {
      "code": "GW",
      "name": {
        "en": "Guinea-Bissau",
        "fr": "Guinée-Bissau"
      }
    },
    "GY": {
      "code": "GY",
      "name": {
        "en": "Guyana",
        "fr": "Guyana"
      }
    },
    "HT": {
      "code": "HT",
      "name": {
        "en": "Haiti",
        "fr": "Haïti"
      }
    },
    "HM": {
      "code": "HM",
      "name": {
        "en": "Heard Island and Mcdonald Islands",
        "fr": "Heard Island et Mcdonald Islands"
      }
    },
    "VA": {
      "code": "VA",
      "name": {
        "en": "Holy See (Vatican City State)",
        "fr": "Saint-Siège (état de la Cité du Vatican)"
      }
    },
    "HN": {
      "code": "HN",
      "name": {
        "en": "Honduras",
        "fr": "Honduras"
      }
    },
    "HK": {
      "code": "HK",
      "name": {
        "en": "Hong Kong",
        "fr": "Hong Kong"
      }
    },
    "HU": {
      "code": "HU",
      "name": {
        "en": "Hungary",
        "fr": "Hongrie"
      }
    },
    "IS": {
      "code": "IS",
      "name": {
        "en": "Iceland",
        "fr": "Islande"
      }
    },
    "IN": {
      "code": "IN",
      "name": {
        "en": "India",
        "fr": "Inde"
      }
    },
    "ID": {
      "code": "ID",
      "name": {
        "en": "Indonesia",
        "fr": "Indonésie"
      }
    },
    "IR": {
      "code": "IR",
      "name": {
        "en": "Iran, Islamic Republic Of",
        "fr": "Iran, Islamic Republic Of"
      }
    },
    "IQ": {
      "code": "IQ",
      "name": {
        "en": "Iraq",
        "fr": "Iraq"
      }
    },
    "IE": {
      "code": "IE",
      "name": {
        "en": "Ireland",
        "fr": "Irlande"
      }
    },
    "IM": {
      "code": "IM",
      "name": {
        "en": "Isle of Man",
        "fr": "Isle of Man"
      }
    },
    "IL": {
      "code": "IL",
      "name": {
        "en": "Israel",
        "fr": "Israël"
      }
    },
    "IT": {
      "code": "IT",
      "name": {
        "en": "Italy",
        "fr": "Italie"
      }
    },
    "JM": {
      "code": "JM",
      "name": {
        "en": "Jamaica",
        "fr": "Jamaïque"
      }
    },
    "JP": {
      "code": "JP",
      "name": {
        "en": "Japan",
        "fr": "Japon"
      }
    },
    "JE": {
      "code": "JE",
      "name": {
        "en": "Jersey",
        "fr": "Jersey"
      }
    },
    "JO": {
      "code": "JO",
      "name": {
        "en": "Jordan",
        "fr": "Jordan"
      }
    },
    "KZ": {
      "code": "KZ",
      "name": {
        "en": "Kazakhstan",
        "fr": "Kazakhstan"
      }
    },
    "KE": {
      "code": "KE",
      "name": {
        "en": "Kenya",
        "fr": "Kenya"
      }
    },
    "KI": {
      "code": "KI",
      "name": {
        "en": "Kiribati",
        "fr": "Kiribati"
      }
    },
    "KP": {
      "code": "KP",
      "name": {
        "en": "Korea, Democratic People'S Republic of",
        "fr": "Corée, République Démocratique ' République de"
      }
    },
    "KR": {
      "code": "KR",
      "name": {
        "en": "Korea, Republic of",
        "fr": "Corée, République de"
      }
    },
    "KW": {
      "code": "KW",
      "name": {
        "en": "Kuwait",
        "fr": "Koweït"
      }
    },
    "KG": {
      "code": "KG",
      "name": {
        "en": "Kyrgyzstan",
        "fr": "Kirghizistan"
      }
    },
    "LA": {
      "code": "LA",
      "name": {
        "en": "Lao People'S Democratic Republic",
        "fr": "Lao People ' s Democratic Republic"
      }
    },
    "LV": {
      "code": "LV",
      "name": {
        "en": "Latvia",
        "fr": "Lettonie"
      }
    },
    "LB": {
      "code": "LB",
      "name": {
        "en": "Lebanon",
        "fr": "Liban"
      }
    },
    "LS": {
      "code": "LS",
      "name": {
        "en": "Lesotho",
        "fr": "Lesotho"
      }
    },
    "LR": {
      "code": "LR",
      "name": {
        "en": "Liberia",
        "fr": "Liberia"
      }
    },
    "LY": {
      "code": "LY",
      "name": {
        "en": "Libyan Arab Jamahiriya",
        "fr": "Jamahiriya arabe libyenne"
      }
    },
    "LI": {
      "code": "LI",
      "name": {
        "en": "Liechtenstein",
        "fr": "Liechtenstein"
      }
    },
    "LT": {
      "code": "LT",
      "name": {
        "en": "Lithuania",
        "fr": "Lituanie"
      }
    },
    "LU": {
      "code": "LU",
      "name": {
        "en": "Luxembourg",
        "fr": "Luxembourg"
      }
    },
    "MO": {
      "code": "MO",
      "name": {
        "en": "Macao",
        "fr": "Macao"
      }
    },
    "MK": {
      "code": "MK",
      "name": {
        "en": "Macedonia, The Former Yugoslav Republic of",
        "fr": "Macédoine, l'ex-République yougoslave de"
      }
    },
    "MG": {
      "code": "MG",
      "name": {
        "en": "Madagascar",
        "fr": "Madagascar"
      }
    },
    "MW": {
      "code": "MW",
      "name": {
        "en": "Malawi",
        "fr": "Malawi"
      }
    },
    "MY": {
      "code": "MY",
      "name": {
        "en": "Malaysia",
        "fr": "Malaisie"
      }
    },
    "MV": {
      "code": "MV",
      "name": {
        "en": "Maldives",
        "fr": "Maldives"
      }
    },
    "ML": {
      "code": "ML",
      "name": {
        "en": "Mali",
        "fr": "Mali"
      }
    },
    "MT": {
      "code": "MT",
      "name": {
        "en": "Malta",
        "fr": "Malte"
      }
    },
    "MH": {
      "code": "MH",
      "name": {
        "en": "Marshall Islands",
        "fr": "Îles Marshall"
      }
    },
    "MQ": {
      "code": "MQ",
      "name": {
        "en": "Martinique",
        "fr": "Martinique"
      }
    },
    "MR": {
      "code": "MR",
      "name": {
        "en": "Mauritania",
        "fr": "Mauritanie"
      }
    },
    "MU": {
      "code": "MU",
      "name": {
        "en": "Mauritius",
        "fr": "Ile Maurice"
      }
    },
    "YT": {
      "code": "YT",
      "name": {
        "en": "Mayotte",
        "fr": "Mayotte"
      }
    },
    
    "FM": {
      "code": "FM",
      "name": {
        "en": "Micronesia, Federated States of",
        "fr": "Micronésie, États fédérés de"
      }
    },
    "MD": {
      "code": "MD",
      "name": {
        "en": "Moldova, Republic of",
        "fr": "Moldavie , République de"
      }
    },
    "MC": {
      "code": "MC",
      "name": {
        "en": "Monaco",
        "fr": "Monaco"
      }
    },
    "MN": {
      "code": "MN",
      "name": {
        "en": "Mongolia",
        "fr": "Mongolie"
      }
    },
    "MS": {
      "code": "MS",
      "name": {
        "en": "Montserrat",
        "fr": "Montserrat"
      }
    },
    "MA": {
      "code": "MA",
      "name": {
        "en": "Morocco",
        "fr": "Maroc"
      }
    },
    "MZ": {
      "code": "MZ",
      "name": {
        "en": "Mozambique",
        "fr": "Mozambique"
      }
    },
    "MM": {
      "code": "MM",
      "name": {
        "en": "Myanmar",
        "fr": "Myanmar"
      }
    },
    "NA": {
      "code": "NA",
      "name": {
        "en": "Namibia",
        "fr": "Namibie"
      }
    },
    "NR": {
      "code": "NR",
      "name": {
        "en": "Nauru",
        "fr": "Nauru"
      }
    },
    "NP": {
      "code": "NP",
      "name": {
        "en": "Nepal",
        "fr": "Népal"
      }
    },
    "NL": {
      "code": "NL",
      "name": {
        "en": "Netherlands",
        "fr": "Pays-Bas"
      }
    },
    "AN": {
      "code": "AN",
      "name": {
        "en": "Netherlands Antilles",
        "fr": "Antilles néerlandaises"
      }
    },
    "NC": {
      "code": "NC",
      "name": {
        "en": "New Caledonia",
        "fr": "Nouvelle Calédonie"
      }
    },
    "NZ": {
      "code": "NZ",
      "name": {
        "en": "New Zealand",
        "fr": "Nouvelle-Zélande"
      }
    },
    "NI": {
      "code": "NI",
      "name": {
        "en": "Nicaragua",
        "fr": "Nicaragua"
      }
    },
    "NE": {
      "code": "NE",
      "name": {
        "en": "Niger",
        "fr": "Niger"
      }
    },
    "NG": {
      "code": "NG",
      "name": {
        "en": "Nigeria",
        "fr": "Nigeria"
      }
    },
    "NU": {
      "code": "NU",
      "name": {
        "en": "Niue",
        "fr": "Niue"
      }
    },
    "NF": {
      "code": "NF",
      "name": {
        "en": "Norfolk Island",
        "fr": "Norfolk Island"
      }
    },
    "MP": {
      "code": "MP",
      "name": {
        "en": "Northern Mariana Islands",
        "fr": "Îles Mariannes du Nord"
      }
    },
    "NO": {
      "code": "NO",
      "name": {
        "en": "Norway",
        "fr": "Norvège"
      }
    },
    "OM": {
      "code": "OM",
      "name": {
        "en": "Oman",
        "fr": "Oman"
      }
    },
    "PK": {
      "code": "PK",
      "name": {
        "en": "Pakistan",
        "fr": "Pakistan"
      }
    },
    "PW": {
      "code": "PW",
      "name": {
        "en": "Palau",
        "fr": "Palau"
      }
    },
    "PS": {
      "code": "PS",
      "name": {
        "en": "Palestinian Territory, Occupied",
        "fr": "Territoire Palestinien, Occupé"
      }
    },
    "PA": {
      "code": "PA",
      "name": {
        "en": "Panama",
        "fr": "Panama"
      }
    },
    "PG": {
      "code": "PG",
      "name": {
        "en": "Papua New Guinea",
        "fr": "Papouasie-Nouvelle-Guinée"
      }
    },
    "PY": {
      "code": "PY",
      "name": {
        "en": "Paraguay",
        "fr": "Paraguay"
      }
    },
    "PE": {
      "code": "PE",
      "name": {
        "en": "Peru",
        "fr": "Pérou"
      }
    },
    "PH": {
      "code": "PH",
      "name": {
        "en": "Philippines",
        "fr": "Philippines"
      }
    },
    "PN": {
      "code": "PN",
      "name": {
        "en": "Pitcairn",
        "fr": "Pitcairn"
      }
    },
    "PL": {
      "code": "PL",
      "name": {
        "en": "Poland",
        "fr": "Pologne"
      }
    },
    "PT": {
      "code": "PT",
      "name": {
        "en": "Portugal",
        "fr": "Portugal"
      }
    },
    "PR": {
      "code": "PR",
      "name": {
        "en": "Puerto Rico",
        "fr": "Puerto Rico"
      }
    },
    "QA": {
      "code": "QA",
      "name": {
        "en": "Qatar",
        "fr": "Qatar"
      }
    },
    "RE": {
      "code": "RE",
      "name": {
        "en": "Reunion",
        "fr": "Réunion"
      }
    },
    "RO": {
      "code": "RO",
      "name": {
        "en": "Romania",
        "fr": "Roumanie"
      }
    },
    "RU": {
      "code": "RU",
      "name": {
        "en": "Russian Federation",
        "fr": "Russian Federation"
      }
    },
    "RW": {
      "code": "RW",
      "name": {
        "en": "RWANDA",
        "fr": "RWANDA"
      }
    },
    "SH": {
      "code": "SH",
      "name": {
        "en": "Saint Helena",
        "fr": "Saint Helena"
      }
    },
    "KN": {
      "code": "KN",
      "name": {
        "en": "Saint Kitts and Nevis",
        "fr": "Saint-Kitts-et-Nevis"
      }
    },
    "LC": {
      "code": "LC",
      "name": {
        "en": "Saint Lucia",
        "fr": "Sainte-Lucie"
      }
    },
    "PM": {
      "code": "PM",
      "name": {
        "en": "Saint Pierre and Miquelon",
        "fr": "Saint Pierre et Miquelon"
      }
    },
    "VC": {
      "code": "VC",
      "name": {
        "en": "Saint Vincent and the Grenadines",
        "fr": "Saint Vincent et les Grenadines"
      }
    },
    "WS": {
      "code": "WS",
      "name": {
        "en": "Samoa",
        "fr": "Samoa"
      }
    },
    "SM": {
      "code": "SM",
      "name": {
        "en": "San Marino",
        "fr": "San Marino"
      }
    },
    "ST": {
      "code": "ST",
      "name": {
        "en": "Sao Tome and Principe",
        "fr": "Sao Tome and Principe"
      }
    },
    "SA": {
      "code": "SA",
      "name": {
        "en": "Saudi Arabia",
        "fr": "Sau Di Arabia"
      }
    },
    "SN": {
      "code": "SN",
      "name": {
        "en": "Senegal",
        "fr": "Sénégal"
      }
    },
    "CS": {
      "code": "CS",
      "name": {
        "en": "Serbia and Montenegro",
        "fr": "Serbie et Monténégro"
      }
    },
    "SC": {
      "code": "SC",
      "name": {
        "en": "Seychelles",
        "fr": "Seychelles"
      }
    },
    "SL": {
      "code": "SL",
      "name": {
        "en": "Sierra Leone",
        "fr": "Sierra Leone"
      }
    },
    "SG": {
      "code": "SG",
      "name": {
        "en": "Singapore",
        "fr": "Singapour"
      }
    },
    "SK": {
      "code": "SK",
      "name": {
        "en": "Slovakia",
        "fr": "Slovaquie"
      }
    },
    "SI": {
      "code": "SI",
      "name": {
        "en": "Slovenia",
        "fr": "Slovénie"
      }
    },
    "SB": {
      "code": "SB",
      "name": {
        "en": "Solomon Islands",
        "fr": "Îles Salomon"
      }
    },
    "SO": {
      "code": "SO",
      "name": {
        "en": "Somalia",
        "fr": "Somalie"
      }
    },
    "ZA": {
      "code": "ZA",
      "name": {
        "en": "South Africa",
        "fr": "Afrique du Sud"
      }
    },
    "GS": {
      "code": "GS",
      "name": {
        "en": "South Georgia and the South Sandwich Islands",
        "fr": "Géorgie du Sud et les îles Sandwich du Sud"
      }
    },
    "ES": {
      "code": "ES",
      "name": {
        "en": "Spain",
        "fr": "Espagne"
      }
    },
    "LK": {
      "code": "LK",
      "name": {
        "en": "Sri Lanka",
        "fr": "Sri Lanka"
      }
    },
    "SD": {
      "code": "SD",
      "name": {
        "en": "Sudan",
        "fr": "Soudan"
      }
    },
    "SR": {
      "code": "SR",
      "name": {
        "en": "Suriname",
        "fr": "Suriname"
      }
    },
    "SJ": {
      "code": "SJ",
      "name": {
        "en": "Svalbard and Jan Mayen",
        "fr": "Svalbard et Jan Mayen"
      }
    },
    "SZ": {
      "code": "SZ",
      "name": {
        "en": "Swaziland",
        "fr": "Swaziland"
      }
    },
    "SE": {
      "code": "SE",
      "name": {
        "en": "Sweden",
        "fr": "Suède"
      }
    },
    "CH": {
      "code": "CH",
      "name": {
        "en": "Switzerland",
        "fr": "Suisse"
      }
    },
    "SY": {
      "code": "SY",
      "name": {
        "en": "Syrian Arab Republic",
        "fr": "République arabe syrienne"
      }
    },
    "TW": {
      "code": "TW",
      "name": {
        "en": "Taiwan, Province of China",
        "fr": "Taiwan, province de Chine"
      }
    },
    "TJ": {
      "code": "TJ",
      "name": {
        "en": "Tajikistan",
        "fr": "Tajikistan"
      }
    },
    "TZ": {
      "code": "TZ",
      "name": {
        "en": "Tanzania, United Republic of",
        "fr": "Tanzanie, République-Unie de"
      }
    },
    "TH": {
      "code": "TH",
      "name": {
        "en": "Thailand",
        "fr": "Thaïlande"
      }
    },
    "TL": {
      "code": "TL",
      "name": {
        "en": "Timor-Leste",
        "fr": "Timor-Leste"
      }
    },
    "TG": {
      "code": "TG",
      "name": {
        "en": "Togo",
        "fr": "Togo"
      }
    },
    "TK": {
      "code": "TK",
      "name": {
        "en": "Tokelau",
        "fr": "Tokelau"
      }
    },
    "TO": {
      "code": "TO",
      "name": {
        "en": "Tonga",
        "fr": "Tonga"
      }
    },
    "TT": {
      "code": "TT",
      "name": {
        "en": "Trinidad and Tobago",
        "fr": "Trinité-et-Tobago"
      }
    },
    "TN": {
      "code": "TN",
      "name": {
        "en": "Tunisia",
        "fr": "Tunisie"
      }
    },
    "TR": {
      "code": "TR",
      "name": {
        "en": "Turkey",
        "fr": "Turquie"
      }
    },
    "TM": {
      "code": "TM",
      "name": {
        "en": "Turkmenistan",
        "fr": "Turkménistan"
      }
    },
    "TC": {
      "code": "TC",
      "name": {
        "en": "Turks and Caicos Islands",
        "fr": "Îles Turques et Caïques"
      }
    },
    "TV": {
      "code": "TV",
      "name": {
        "en": "Tuvalu",
        "fr": "Tuvalu"
      }
    },
    "UG": {
      "code": "UG",
      "name": {
        "en": "Uganda",
        "fr": "Ouganda"
      }
    },
    "UA": {
      "code": "UA",
      "name": {
        "en": "Ukraine",
        "fr": "Ukraine"
      }
    },
    "AE": {
      "code": "AE",
      "name": {
        "en": "United Arab Emirates",
        "fr": "Emirats Arabes Unis"
      }
    },
    "GB": {
      "code": "GB",
      "name": {
        "en": "United Kingdom",
        "fr": "Royaume-Uni"
      }
    },
    
    "UM": {
      "code": "UM",
      "name": {
        "en": "United States Minor Outlying Islands",
        "fr": "United States Minor Outlying Islands"
      }
    },
    "UY": {
      "code": "UY",
      "name": {
        "en": "Uruguay",
        "fr": "Uruguay"
      }
    },
    "UZ": {
      "code": "UZ",
      "name": {
        "en": "Uzbekistan",
        "fr": "Ouzbékistan"
      }
    },
    "VU": {
      "code": "VU",
      "name": {
        "en": "Vanuatu",
        "fr": "Vanuatu"
      }
    },
    "VE": {
      "code": "VE",
      "name": {
        "en": "Venezuela",
        "fr": "Venezuela"
      }
    },
    "VN": {
      "code": "VN",
      "name": {
        "en": "Viet Nam",
        "fr": "Viet Nam"
      }
    },
    "VG": {
      "code": "VG",
      "name": {
        "en": "Virgin Islands, British",
        "fr": "Îles Vierges britanniques"
      }
    },
    "VI": {
      "code": "VI",
      "name": {
        "en": "Virgin Islands, U.S.",
        "fr": "Îles Vierges, US"
      }
    },
    "WF": {
      "code": "WF",
      "name": {
        "en": "Wallis and Futuna",
        "fr": "Wallis et Futuna"
      }
    },
    "EH": {
      "code": "EH",
      "name": {
        "en": "Western Sahara",
        "fr": "Sahara occidental"
      }
    },
    "YE": {
      "code": "YE",
      "name": {
        "en": "Yemen",
        "fr": "Yémen"
      }
    },
    "ZM": {
      "code": "ZM",
      "name": {
        "en": "Zambia",
        "fr": "Zambie"
      }
    },
    "ZW": {
      "code": "ZW",
      "name": {
        "en": "Zimbabwe",
        "fr": "Zimbabwe"
      }
    }
  }
  var provinces = {
    AB: {
      geogratis: 48,
      en: 'Alberta',
      fr: 'Alberta'
    },
    BC: {
      geogratis: 59,
      en: 'British Columbia',
      fr: 'Columbie Britanique'
    },
    MB: {
      geogratis:46,
      en: 'Manitoba',
      fr: 'Manitoba'
    },
    NB: {
      geogratis:13,
      en: 'New Brunswick',
      fr: 'Nouveau Brunswick'
    },
    NL: {
      geogratis:10,
      en: 'Newfoundland',
      fr: 'Terre-Neuve'
    },
    NS: {
      geogratis:12,
      en: 'Nova Scotia',
      fr: 'Nouvelle Écosse'
    },
    NT: {
      geogratis: 61,
      en: 'Northwest Territories',
      fr: 'Territoires du nord-ouest'
    },
    NU: {
      geogratis: 62,
      en: 'Nunavut',
      fr: 'Nunavut'
    },
    ON: {
      geogratis:35,
      en: 'Ontario',
      fr: 'Ontario'
    },
    PE: {
      geogratis:11,
      en: "Prince Edward Island",
      fr: "Île-du-Prince-Édouard"
    },
    QC: {
      geogratis:24,
      en: 'Quebec',
      fr: 'Québec'
    },
    SK: {
      geogratis:47,
      en: 'Saskatchewan',
      fr: 'Saskatchewan'
    },
    YT: {
      geogratis:60,
      en: 'Yukon Territory',
      fr: 'Territoire du Yukon'
    }
  }
//   var cityNames = {};
// 'http://geogratis.gc.ca/services/geoname/en/geonames.json?province=24&concise=CITY&num=1000&category=O&sort-field=name'
 
// function getCityNames( province ){
//   return new Promise( function( resolve, reject ){
//     if(cityNames[province]){
//       return resolve( cityNames[province] );
//     }else{
//       var ajax = document.createElement('iron-ajax');
//       ajax.params = { province: province, concise: 'CITY', num: '1000'}
               
//     }
//   });
//   if(!cityNames[province]){
     
//   }
// }
 
 
 EDB.Geonames = {
   init: function( app ){
     
     app.set('listOfCountries', Object.keys( countries ).map( function( k ){
       return countries[k];
     }));
     
     
     app.set('listOfProvinces', Object.keys( provinces ).map( function( k ){
       var province = {code: k, name: provinces[k] };
        
        return province;
     }));
     console.log('listOfProvinces', app.get('listOfProvinces') );
     
   },
   
 }
  
})(window)