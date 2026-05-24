// 프로필 영역 데이터
// - 프로젝트 외 공통 프로필 정보는 이 객체에서 관리합니다.
const profileData = {
  photo: 'images/me_pic.jpg',
  name: '이승민',
  meta: '남 · 1994년생 (31세)',
  cards: [
    {
      title: '경력',
      iconSvg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 6h-2.18c.07-.44.18-.88.18-1.34C18 2.99 16.21 1 14 1c-1.22 0-2.35.5-3.16 1.32L10 3.15l-.84-.83C8.35 1.5 7.22 1 6 1 3.79 1 2 2.99 2 5.34c0 .46.11.9.18 1.34H0v14h24V6h-4zm-6-3c.9 0 1.63.7 1.63 1.56S14.9 6.1 14 6.1H10.56c.06-.15.1-.31.14-.47L11 5.15V5c0-.9.73-1.63 1.63-1.63h.74zM6 3.37c.9 0 1.63.73 1.63 1.63v.15l.3.48c.04.16.08.32.14.47H4.37C3.47 6.1 2.74 5.36 2.74 4.46S3.1 3 4 3h2zM22 18H2V8h20v10z"/></svg>',
      inline: false,
      lines: ['총 <b>3년 5개월</b>'],
      expandable: false,
      details: [
        '오산 소재 클린룸 모니터링 솔루션 업체<br>(프로젝트 종료, 10개월)',
        '동탄 소재 머신비전 솔루션 업체<br>(납품 완료, 10개월)',
        '수원 소재 실내 자율주행 업체<br>(테스트 종료, 6개월)',
        '평택 소재 반도체 장비 업체<br>(납품 완료, 1년 5개월)'
      ]
    },
    {
      title: '학력',
      iconSvg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>',
      lines: ['고려대학교 (안암)', '학부 4년 졸업']
    },
    {
      title: '스킬',
      iconSvg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>',
      skillGroups: [
        {
          label: '장비제어',
          badges: ['드라이버 개발', '제어 프로그램 연동']
        },
        {
          label: 'IT개발',
          badges: ['웹 API', 'ASP.NET']
        }
      ]
    }
  ]
};

// 프로젝트 데이터
// - 새 프로젝트를 추가할 때는 아래 배열에 객체를 추가하세요.
// - 기본적으로 number, title, period, tags, summary, detail 항목만 있으면 목록/상세가 렌더링됩니다.
// - layoutType은 기존 화면 템플릿과 연결됩니다.
const projectList = [
  {
    id: 'motion-control',
    layoutType: 'motionControl',
    number: 'PROJECT 01',
    title: '모션 제어',
    period: '2023.06 ~ 2023.10',
    anchorId: 'project-motion-control',
    bannerSubtitle: '모션 제어 — 웨이퍼 Z축 스테이지',
    tags: ['IT개발', '품질 테스트', '유지보수'],
    summary: [
      '웨이퍼 스테이지 상승, 하강 모션',
      '엔코더 폐루프 자동 왕복 기능 구현, 테스트',
      '엔코더 2개 동시 작동 시 타이밍 오차 개선 및 해결',
      '미쓰비시 제어 프로그램 연동',
      '품질 평가 리포트 출력 기능'
    ],
    detail: {
      projectName: '웨이퍼 Z축 스테이지 제어',
      informationRows: [
        {
          iconClass: 'bi bi-calendar3',
          label: '기간',
          lines: ['4개월 (2023.06 ~ 2023.10)']
        },
        {
          iconClass: 'bi bi-bullseye',
          label: '목표',
          lines: ['웨이퍼 Z축 2개 스테이지 상승/하강', '자동 제어 및 동기화 검증']
        },
        {
          iconClass: 'bi bi-person-fill',
          label: '역할',
          lines: ['IT 개발 : 통신 및 제어 프로그램', '품질 테스트 및 유지보수']
        }
      ],
      systemDiagram: {
        headerNumber: '1',
        title: '시스템 구성도',
        description: '시스템 연결 구조',
        nodes: [
          { iconClass: 'bi bi-laptop', name: 'PC 프로그램', subText: '(테스트 프로그램)' },
          { iconClass: 'bi bi-server', name: '모션 컨트롤러', subText: '(양산품)' },
          { iconClass: 'bi bi-cpu', name: '서보 드라이버', subText: '(MEL서보)' },
          { iconClass: 'bi bi-gear-fill', name: '엔코더 모터', subText: '(AC 서보)' },
          { iconClass: 'bi bi-disc-fill', name: '웨이퍼 스테이지', subText: '(1, 2번 축)' }
        ],
        arrowLabels: ['이더넷', '', '', '']
      }
    },
    motionControlContent: {
      melSoftwareImage: 'images/mel-program.png',
      flowDescriptionSteps: [
        { title: '1. 초기화', description: 'Servo ON → Home Move → Wait Home Complete' },
        { title: '2. 자동 사이클', description: 'Auto Cycle Start 후 Z축 상대위치 이동' },
        { title: '3. 위치 확인', description: 'Encoder Position Polling → Z1/Z2 InPosition Check' },
        { title: '4. 반복 처리', description: 'Delay → Move Z Down → 엔코더 피드백 → 횟수 증가' },
        { title: '5. 종료 판정', description: '반복 횟수 도달 시 Complete, 미도달 시 사이클 재시작' }
      ],
      analysisRows: [
        ['1회', '10:15:23', '95 r/min', '302 r/min', '0.42 sec', '3 pulse', '120 ms', '정상'],
        ['2회', '10:15:31', '96 r/min', '301 r/min', '0.41 sec', '2 pulse', '118 ms', '정상'],
        ['3회', '10:15:39', '94 r/min', '303 r/min', '0.43 sec', '4 pulse', '121 ms', '정상'],
        ['4회', '10:15:47', '95 r/min', '300 r/min', '0.42 sec', '3 pulse', '119 ms', '정상'],
        ['5회', '10:15:55', '96 r/min', '302 r/min', '0.41 sec', '2 pulse', '120 ms', '정상']
      ],
      analysisSummary: '5회 반복 동작 모두 정상 범위 내에서 수행되었으며, 속도 변화, 가속 시간, 위치 편차, 왕복 딜레이 값이 안정적으로 유지되었습니다.'
    }
  },
  {
    id: 'autonomous-driving',
    layoutType: 'autonomousDriving',
    number: 'PROJECT 02',
    title: '자율주행차 모터 및 센서 연동',
    period: '2023.10 ~ 2024.04',
    anchorId: 'project-autonomous-driving',
    bannerSubtitle: '자율주행차 모터 및 센서 연동',
    tags: ['임베디드', '센서 파싱', '자율주행'],
    summary: [
      '키보드 입력 데이터를 모터 제어 신호로 변환하여 모터 드라이버 및 모터 회전 제어 구현',
      '2D LiDAR 센서 RAW 데이터 파싱 및 2D 지도 변환 기능 구현',
      '변환된 지도 데이터를 UI 및 RViz 프로그램과 연동하여 실시간 시각화 구현'
    ],
    detail: {
      projectName: '자율주행차 모터 및 센서 연동',
      informationRows: [
        {
          iconClass: 'bi bi-calendar3',
          label: '기간',
          lines: ['6개월 (2023.10 ~ 2024.04)']
        }
      ]
    },
    autonomousDrivingContent: {
      robotArm: {
        specSummary: '스펙 요약 : 라즈베리 보드, 임베디드 PC, 마이크로 서보, 자율주행차 테스트 키트',
        photos: [
          { imagePath: 'images/robot_servo.png', alt: '서보', label: '마이크로 서보 (MG90S)' },
          { imagePath: 'images/robot_arm.png', alt: '로봇팔', label: '아두이노 로봇팔 (2축)' },
          { imagePath: 'images/robot_car.png', alt: '자율주행차', label: '자율주행 테스트 키트' }
        ]
      },
      robotLidar: {
        specSummary: '스펙 요약 : 2D 라이다 센서, 임베디드 PC (Jetson), 데이터 파싱 프로그램',
        photos: [
          { imagePath: 'images/lidar.png', alt: '2D 라이다', label: '2D LiDAR 센서' },
          { imagePath: 'images/embedded_pc.png', alt: '임베디드PC', label: '임베디드 PC (Jetson)' },
          { imagePath: 'images/map3.png', alt: '2D 지도', label: '2D 지도 변환 결과' },
          { imagePath: 'images/car_lidar.png', alt: '차-라이다', label: '자율주행차 + 라이다 위치' }
        ]
      }
    }
  }
];
