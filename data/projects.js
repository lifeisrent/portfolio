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
      inlineHeadText: '총 <b>3년 5개월</b>',
      lines: [],
      expandable: true,
      details: [
        '오산 SI 기업<br>(클린룸 모니터링 솔루션 프로젝트 종료, 10개월)',
        '동탄 머신비전 스타트업<br>(웨이퍼 이미지 솔루션 납품 완료, 10개월)',
        '수원 반도체 기업<br>(공장 실내 자율주행 테스트 종료, 6개월)',
        '평택 반도체 기업<br>(웨이퍼 스테이지 테스트 종료, 1년 5개월)'
      ]
    },
    {
      title: '학력',
      iconSvg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>',
      inlineHeadText: '고려대학교 (안암)',
      lines: [],
      expandable: true,
      details: [
        '문과대학 학부 4년 졸업',
        '고려대학교 선택과목 수강 내역',
        'C언어 프로그래밍 및 알고리즘 설계 강의 이수',
        'JAVA 객체지향 프로그래밍 기반 애플리케이션 제작 강의 이수',
        '현대자동차 인턴십 연계 언어인식 모델 구현 및 AI 응용 교육 참여'
      ]
    },
    {
      title: '스킬',
      iconSvg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>',
      skillGroups: [
        {
          label: 'AI',
          progress: 80
        },
        {
          label: '장비제어',
          progress: 70,
          badges: ['드라이버 개발', '제어프로그램 연동']
        },
        {
          label: 'IT 개발',
          progress: 70,
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
    number: 'PROJECT 03',
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
  },
  {
    id: 'cleanroom-environment-solution',
    layoutType: 'cleanroomEnvironment',
    number: 'PROJECT 01',
    title: '클린룸 환경 솔루션',
    period: '기간 미정',
    anchorId: 'project-cleanroom-environment',
    bannerSubtitle: '클린룸 환경 솔루션',
    tags: ['Gateway 서버', '장비 모니터링', '센서 인터페이스', 'PLC 통신', '데이터 수집'],
    summary: [
      'PC 내부에서만 가능했던 설비 상태 확인 및 제어를 외부 기기에서도 확인 가능하도록 구성',
      'Gateway 서버를 통해 노트북, 핸드폰에서 장비 상태 확인 및 알람 수신 가능',
      '센서, 모터, PLC, 산업용 프로토콜, 비전 검사, 데이터 수집 기능 연동'
    ],
    detail: {
      projectName: '클린룸 환경 솔루션',
      informationRows: [
        {
          iconClass: 'bi bi-exclamation-circle-fill',
          label: '문제 상황',
          lines: [
            '기존 설비 환경에서는 모터 및 센서가 연결된 제어 PC 내부에서만 상태 확인 및 제어가 가능'
          ]
        },
        {
          iconClass: 'bi bi-diagram-3-fill',
          label: '해결 방식',
          lines: ['PC에 Gateway 서버를 설치']
        },
        {
          iconClass: 'bi bi-gear-wide-connected',
          label: '구현 내용',
          lines: ['센서, 모터, PLC, 산업용 프로토콜, 비전 검사, 데이터 수집 기능 연동']
        }
      ]
    },
    cleanroomEnvironmentContent: {
      problemLines: [
        '기존 설비 환경에서는 모터 및 센서가 연결된 제어 PC 내부에서만 상태 확인 및 제어가 가능',
        'PC - 유선연결 - 모터/센서'
      ],
      solutionIntro: 'PC에 Gateway 서버를 설치',
      solutionSteps: [
        '외부 노트북, 핸드폰에서 상태 확인, 알람 수신 가능.',
        '원격 데스크톱 없이 PC에 연결된 모든 센서/모터/장비 모니터링 가능',
        '제한적으로 장비 시작, 중지 등 제어 기능 수행'
      ],
      implementationItems: [
        {
          title: 'PC-핸드폰 연동',
          description: '장비 알람 발생 시 카카오톡, 텔레그램 메세지 전송'
        },
        {
          title: 'SNS로 리포트 수신',
          description: '장비 작동 결과, 주 단위 생산 결과 통계 등'
        },
        {
          title: '모션 제어',
          details: [
            '서보 모터, 엔코더 모터, 스테이지 제어',
            '위치 이동, 속도 제어, 원점 복귀(Home) 등'
          ]
        },
        {
          title: '센서 인터페이스',
          details: [
            '각종 산업용 센서 데이터 수집 및 상태 모니터링',
            '압력, 온도, 파티클, 라이다 센서 등'
          ]
        },
        {
          title: 'PLC 통신',
          details: [
            'PLC와의 데이터 송수신 및 제어 연동',
            'Mitsubishi, Siemens, Omron 등 PLC 프로토콜 활용'
          ]
        },
        {
          title: '산업용 프로토콜',
          details: ['EtherCAT, Modbus, CAN, RS-485 등']
        },
        {
          title: '비전 검사',
          details: ['라인카메라 촬영 및 이미지 처리 시스템']
        },
        {
          title: '데이터 수집',
          details: [
            '센서 및 장비 데이터 실시간 수집',
            '실시간 데이터 DB 저장 및 통계 데이터 분석'
          ]
        },
        {
          title: '장비 자동화',
          details: [
            '장비 시퀀스 제어 및 자동화 로직 구현',
            '반복 동작, 인터락, 알람 처리 등'
          ]
        }
      ]
    }
  }
];
