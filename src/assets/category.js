export const regions = {
    '수원시 장안구': ['파장동', '율천동', '정자1동', '정자2동', '정자3동', '영화동', '송죽동', '조원1동', '조원2동', '연무동'],
    '수원시 권선구': ['세류1동', '세류2동', '세류3동', '평동', '서둔동', '구운동', '금곡동', '호매실동', '권선1동', '권선2동', '곡선동', '입북동'],
    '수원시 팔달구': ['매교동', '매산동', '고등동', '화서1동', '화서2동', '지동', '우만1동', '우만2동', '인계동', '행궁동'],
    '수원시 영통구': ['매탄1동', '매탄2동', '매탄3동', '매탄4동', '원천동', '영통1동', '영통2동', '영통3동', '망포1동', '망포2동', '광교1동', '광교2동'],
    '안양시 만안구': ['안양1동', '안양2동', '안양3동', '안양4동', '안양5동', '안양6동', '안양7동', '안양8동', '안양9동', '석수1동', '석수2동', '석수3동', '박달1동', '박달2동'],
    '안양시 동안구': ['비산1동', '비산2동', '비산3동', '부흥동', '달안동', '관양1동', '관양2동', '부림동', '평촌동', '평안동', '귀인동', '호계1동', '호계2동', '호계3동', '범계동', '신촌동', '갈산동'],
    '광명시': ['광명1동', '광명2동', '광명3동', '광명4동', '광명5동', '광명6동', '광명7동', '철산1동', '철산2동', '철산3동', '철산4동', '하안1동', '하안2동', '하안3동', '하안4동', '소하1동', '소하2동', '일직동', '학온동'],
    '시흥시': ['대야동', '신천동', '신현동', '은행동', '매화동', '목감동', '군자동', '월곶동', '정왕본동', '정왕1동', '정왕2동', '정왕3동', '정왕4동', '배곧1동', '배곧2동', '과림동', '연성동', '장곡동', '능곡동', '거북섬동'],
    '화성시': ['봉담읍', '우정읍', '향남읍', '남양읍', '매송면', '비봉면', '마도면', '송산면', '서신면', '팔탄면', '장안면', '양감면', '정남면', '새솔동', '진안동', '병점1동', '병점2동', '반월동', '기배동', '화산동', '동탄1동', '동탄2동', '동탄3동', '동탄4동', '동탄5동', '동탄6동', '동탄7동', '동탄8동', '동탄9동']
  };
  
  export const categories = {
    '소매/유통': ['음/식료품소매', '제조/도매', '건강/기호식품', '스포츠/레져용품', '의복/의류', '종합소매점', '패션잡화', '인테리어/가정용품', '차량관리/부품', '서적/도서', '선물/완구', '악기/공예', '가전제품', '화장품소매', '사무/교육용품', '유아용품', '차량판매'],
    '음식': ['일식/수산물', '커피/음료', '한식', '닭/오리요리', '별식/퓨전요리', '고기요리', '분식', '양식', '음식배달서비스', '제과/제빵/떡/케익', '유흥주점', '중식', '패스트푸드', '부페', '휴게소/대형업체'],
    '학문/교육': ['예체능계학원', '외국어학원', '유아교육', '입시학원', '독서실/고시원', '기타교육', '기술/직업교육학원', '자동차학원', '학교'],
    '의료/건강': ['의약/의료품', '특화병원', '일반병원', '기타의료', '수의업', '종합병원'],
    '생활서비스': ['미용서비스', '전문서비스', '차량관리/서비스', '회비/공과금', '수리서비스', '보안/운송', '광고/인쇄/인화', '세탁/가사서비스', '교통서비스', '렌탈서비스', '가례서비스', '금융상품/서비스', '무점포서비스', '부동산', '사우나/휴게시설', '연료판매', '여행/유학대행'],
    '여가/오락': ['요가/단전/마사지', '일반스포츠', '숙박', '취미/오락'],
    '미디어/통신': ['방송/미디어', '시스템/통신', '인터넷쇼핑'],
    '공연/전시': ['전시장', '공연관람', '문화서비스', '경기관람'],
    // '공공/기업/단체': ['단체', '기업', '종교', '공공기관']
  };
  
  export const synergyPairs = [
    { antecedent: '일반병원', consequent: '특화병원', icon: 'faClinicMedical' },
    { antecedent: '특화병원', consequent: '일반병원', icon: 'faUserMd' },
    { antecedent: '의약/의료품', consequent: '일반병원', icon: 'faUserMd' },
    { antecedent: '일반병원', consequent: '의약/의료품', icon: 'faCapsules' },
    // { antecedent: '기업', consequent: '제조/도매', icon: 'faIndustry' },
    // { antecedent: '제조/도매', consequent: '기업', icon: 'faBuilding' },
    { antecedent: '차량관리/서비스', consequent: '제조/도매', icon: 'faIndustry' },
    { antecedent: '제조/도매', consequent: '차량관리/서비스', icon: 'faCar' },
    { antecedent: '일식/수산물', consequent: '한식', icon: 'faUtensils' },
    { antecedent: '한식', consequent: '일식/수산물', icon: 'faFish' },
    { antecedent: '한식', consequent: '고기요리', icon: 'faUtensils' },
    { antecedent: '고기요리', consequent: '한식', icon: 'faUtensils' },
    { antecedent: '제조/도매', consequent: '인테리어/가정용품', icon: 'faShoppingBag' },
    { antecedent: '인테리어/가정용품', consequent: '제조/도매', icon: 'faIndustry' },
    { antecedent: '의복/의류', consequent: '제조/도매', icon: 'faIndustry' },
    { antecedent: '제조/도매', consequent: '의복/의류', icon: 'faTshirt' },
    { antecedent: '커피/음료', consequent: '한식', icon: 'faUtensils' },
    { antecedent: '한식', consequent: '커피/음료', icon: 'faCoffee' },
    { antecedent: '의복/의류', consequent: '한식', icon: 'faUtensils' },
    { antecedent: '한식', consequent: '의복/의류', icon: 'faTshirt' },
    { antecedent: '한식', consequent: '일반병원', icon: 'faUserMd' },
    { antecedent: '일반병원', consequent: '한식', icon: 'faUtensils' },
    { antecedent: '의약/의료품', consequent: '한식', icon: 'faUtensils' },
    { antecedent: '한식', consequent: '의약/의료품', icon: 'faCapsules' },
    { antecedent: '한식', consequent: '제조/도매', icon: 'faIndustry' },
    { antecedent: '제조/도매', consequent: '한식', icon: 'faUtensils' },
    { antecedent: '한식', consequent: '음/식료품소매', icon: 'faAppleAlt' },
    { antecedent: '음/식료품소매', consequent: '한식', icon: 'faUtensils' },
    { antecedent: '한식', consequent: '인테리어/가정용품', icon: 'faShoppingBag' },
    { antecedent: '인테리어/가정용품', consequent: '한식', icon: 'faUtensils' },
    { antecedent: '일반병원', consequent: '종합소매점', icon: 'faStore' },
    { antecedent: '종합소매점', consequent: '일반병원', icon: 'faUserMd' },
    { antecedent: '의약/의료품', consequent: '종합소매점', icon: 'faStore' },
    { antecedent: '종합소매점', consequent: '의약/의료품', icon: 'faCapsules' },
    { antecedent: '종합소매점', consequent: '의복/의류', icon: 'faTshirt' },
    { antecedent: '의복/의류', consequent: '종합소매점', icon: 'faStore' },
    { antecedent: '음/식료품소매', consequent: '종합소매점', icon: 'faStore' },
    { antecedent: '종합소매점', consequent: '음/식료품소매', icon: 'faAppleAlt' },
    { antecedent: '종합소매점', consequent: '한식', icon: 'faUtensils' },
    { antecedent: '한식', consequent: '종합소매점', icon: 'faStore' }
  ];
  