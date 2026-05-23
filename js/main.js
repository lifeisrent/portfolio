// DOM selector constants
const PROJECT_LIST_SELECTOR = '#project-list-container';
const PROJECT_DETAIL_SELECTOR = '#project-detail-container';
const PROFILE_PANEL_SELECTOR = '#profile-panel';
const FLOW_MODAL_CONTAINER_SELECTOR = '#flow-modal-container';

// Simulation configuration values
const simulationSettings = {
  maximumTravel: 120,
  maximumPulse: 5000,
  normalSpeed: 1.4,
  errorSpeed: 0.45,
  frameDeltaCap: 0.05,
  minimumSyncBarWidth: 0.04,
  syncBarMaxWidth: 360,
  simulationIntervalMilliseconds: 130,
  stageResetHighlightMilliseconds: 2500
};

// Simulation runtime state
const simulationState = {
  isRunning: false,
  hasError: false,
  stageAPositionRatio: 0,
  stageBPositionRatio: 0,
  stageADirection: 1,
  stageBDirection: 1,
  completedRepeatCount: 0,
  targetRepeatCount: 5,
  lastAnimationTimestamp: null
};

// Auto control runtime state
const autoControlState = {
  timerIdentifier: null,
  currentRepeatCount: 0,
  increaseStep: 250,
  intervalMilliseconds: 300
};

// JOG runtime state
const jogControlState = {
  timerIdentifier: null,
  direction: 'forward',
  currentPosition: 0,
  minimumPosition: -5000,
  maximumPosition: 5000,
  updateIntervalMilliseconds: 80
};

document.addEventListener('DOMContentLoaded', initializePortfolioPage);

function initializePortfolioPage() {
  // 1) Render UI from data
  renderProfilePanel();
  renderProjectList();
  renderProjectDetail();
  renderFlowModal();

  // 2) Attach all events after rendering
  initializeProjectNavigation();
  initializeTabs();
  initializeFlowModal();
  initializeSystemDiagramAnimation();
  initializeSimulation();
  initializeAutoControl();
  initializeJogControl();
  initializeExcelDownload();

  renderJogCurrentPosition();
}

function renderProfilePanel() {
  const profilePanelElement = document.querySelector(PROFILE_PANEL_SELECTOR);

  if (!profilePanelElement || !profileData) {
    return;
  }

  const profileCardsMarkup = profileData.cards
    .map((card) => {
      if (card.skillGroups) {
        return `
          <div class="p-card">
            <div class="p-card-head">
              ${card.iconSvg}
              ${card.title}
            </div>
            <div class="p-card-body">
              ${card.skillGroups
                .map(
                  (skillGroup, index) => `
                    <div class="skill-row" style="${index === 0 ? 'align-items:center;' : 'margin-top:6px;align-items:center;'}">
                      <span style="font-size:15px;font-weight:700;color:#555;white-space:nowrap;margin-right:2px;">${skillGroup.label} :</span>
                      ${skillGroup.badges
                        .map((badgeText) => `<span class="badge">${badgeText}</span>`)
                        .join('')}
                    </div>
                  `
                )
                .join('')}
            </div>
          </div>
        `;
      }

      const cardBodyMarkup = card.lines.map((lineText) => `${lineText}`).join('<br>');

      return `
        <div class="p-card">
          <div class="p-card-head">
            ${card.iconSvg}
            ${card.title}
          </div>
          <div class="p-card-body">${cardBodyMarkup}</div>
        </div>
      `;
    })
    .join('');

  profilePanelElement.innerHTML = `
    <div class="profile-top">
      <img class="profile-photo" src="${profileData.photo}" alt="프로필 사진">
      <div class="profile-info">
        <div class="profile-name">${profileData.name}</div>
        <div class="profile-meta">${profileData.meta}</div>
      </div>
    </div>
    <div class="profile-cards">
      ${profileCardsMarkup}
    </div>
  `;
}

function renderProjectList() {
  const projectListElement = document.querySelector(PROJECT_LIST_SELECTOR);

  if (!projectListElement) {
    return;
  }

  const projectRowMarkup = projectList
    .map(
      (project) => `
        <div class="proj-row" data-scroll-target="${project.anchorId}" role="button" tabindex="0">
          <div class="proj-row-num">${project.number}</div>
          <div class="proj-row-title">${project.title}</div>
          <div class="proj-row-desc">
            <ul>
              ${project.summary.map((summaryText) => `<li>${summaryText}</li>`).join('')}
            </ul>
          </div>
          <div>
            ${project.tags.map((tagText) => `<span class="badge">${tagText}</span>`).join('')}
          </div>
        </div>
      `
    )
    .join('');

  const nextProjectNumber = String(projectList.length + 1).padStart(2, '0');

  projectListElement.innerHTML = `
    ${projectRowMarkup}
    <div class="proj-row-empty">PROJECT ${nextProjectNumber} &nbsp;·&nbsp; 내용을 추가해주세요</div>
  `;
}

function renderProjectDetail() {
  const projectDetailElement = document.querySelector(PROJECT_DETAIL_SELECTOR);

  if (!projectDetailElement) {
    return;
  }

  projectDetailElement.innerHTML = projectList
    .map((project) => renderProjectLayout(project))
    .join('');
}

function renderProjectLayout(project) {
  const projectDetailCardMarkup = renderProjectDetailCard(project);

  if (project.layoutType === 'motionControl') {
    return `
      ${renderProjectBanner(project)}
      <div class="rs-block">${projectDetailCardMarkup}</div>
      ${renderMotionControlSection(project)}
    `;
  }

  if (project.layoutType === 'autonomousDriving') {
    return `
      ${renderProjectBanner(project)}
      <div class="rs-block">${projectDetailCardMarkup}</div>
      ${renderAutonomousDrivingSection(project)}
    `;
  }

  return `
    ${renderProjectBanner(project)}
    <div class="rs-block">${projectDetailCardMarkup}</div>
  `;
}

function renderProjectBanner(project) {
  return `
    <div class="proj-banner" id="${project.anchorId}">
      <span>${project.number}</span>
      <span class="proj-banner-sub">· ${project.bannerSubtitle}</span>
    </div>
  `;
}

function renderProjectDetailCard(project) {
  const informationRowsMarkup = project.detail.informationRows
    .map(
      (informationRow) => `
        <div class="d-info-row">
          <i class="${informationRow.iconClass} d-info-icon"></i>
          <div class="d-info-content">
            <span class="d-info-label">${informationRow.label}</span>
            ${informationRow.lines
              .map((lineText) => `<span class="d-info-text">${lineText}</span>`)
              .join('')}
          </div>
        </div>
      `
    )
    .join('');

  const systemDiagramMarkup = project.detail.systemDiagram
    ? renderSystemDiagramPreview(project.detail.systemDiagram)
    : '';

  return `
    <div class="detail-info-card">
      <div>
        <div class="d-label">프로젝트</div>
        <div class="d-proj-name">${project.detail.projectName}</div>
      </div>
      <div style="height:2px;background:#1565C0;width:100%;border-radius:2px;"></div>
      <div class="d-info-block">
        ${informationRowsMarkup}
      </div>
      ${systemDiagramMarkup}
    </div>
  `;
}

function renderSystemDiagramPreview(systemDiagramData) {
  const systemNodeMarkup = systemDiagramData.nodes
    .map((node, index) => {
      const arrowLabel = systemDiagramData.arrowLabels[index] ?? '';
      const arrowMarkup =
        index < systemDiagramData.nodes.length - 1
          ? `
            <div class="sysdiag-arr">
              <span class="sysdiag-arr-label">${arrowLabel || '&nbsp;'}</span>
              <span class="sysdiag-arr-icon"><i class="bi bi-arrow-right"></i></span>
            </div>
          `
          : '';

      return `
        <div class="sysdiag-node">
          <div class="sysdiag-icon-bg"><i class="${node.iconClass}"></i></div>
          <div class="sysdiag-node-name">${node.name}</div>
          <div class="sysdiag-node-sub">${node.subText}</div>
        </div>
        ${arrowMarkup}
      `;
    })
    .join('');

  return `
    <div class="sysdiag-box" style="margin-top:8px;">
      <div class="sysdiag-header" style="padding-bottom:10px;border-bottom:1.5px solid #dce8f8;margin-bottom:12px;">
        <div class="sysdiag-num">${systemDiagramData.headerNumber}</div>
        <div>
          <div class="sysdiag-ttl">${systemDiagramData.title}</div>
          <div class="sysdiag-desc">${systemDiagramData.description}</div>
        </div>
      </div>
      <div class="sysdiag-flow" id="sysdiag-flow-det" data-animated-flow="true">
        ${systemNodeMarkup}
      </div>
    </div>
  `;
}

function renderMotionControlSection(project) {
  return `
    <div class="rs-block" id="motion-control-tab-section">
      <div class="rs-section-title">📐 시스템 구성도</div>
      <div class="tabs" data-tab-group-container="motion-control-tabs">
        <div class="tab active" data-tab-button="true" data-tab-group="motion-control-tabs" data-tab-target="motion-control-tab-diagram">구성도</div>
        <div class="tab" data-tab-button="true" data-tab-group="motion-control-tabs" data-tab-target="motion-control-tab-flow">흐름도</div>
      </div>

      <div id="motion-control-tab-diagram" class="tab-pane active" data-tab-pane-group="motion-control-tabs">
        ${renderMotionControlDiagramTab(project)}
      </div>

      <div id="motion-control-tab-flow" class="tab-pane" data-tab-pane-group="motion-control-tabs">
        ${renderMotionControlFlowTab(project)}
      </div>
    </div>

    ${renderMotionSimulationSection()}
  `;
}

function renderMotionControlDiagramTab(project) {
  const analysisTableRowsMarkup = project.motionControlContent.analysisRows
    .map(
      (analysisRow) => `
        <tr>
          <td>${analysisRow[0]}</td>
          <td>${analysisRow[1]}</td>
          <td>${analysisRow[2]}</td>
          <td>${analysisRow[3]}</td>
          <td>${analysisRow[4]}</td>
          <td>${analysisRow[5]}</td>
          <td>${analysisRow[6]}</td>
          <td class="mel-result-good">${analysisRow[7]}</td>
        </tr>
      `
    )
    .join('');

  return `
    <div class="hdiag-section">
      <div class="hdiag-block">
        <div class="hdiag-block-title">▎ 하드웨어 구성도</div>
        <div class="hdiag-hflow">
          <div class="hdiag-node"><div class="hdiag-node-box c-pc">PC 프로그램<br><span style="font-size:11px;font-weight:400;">(테스트 프로그램)</span></div></div>
          <div class="hdiag-harrow"><span>이더넷</span>→</div>
          <div class="hdiag-node"><div class="hdiag-node-box c-ctrl">모션 컨트롤러<br><span style="font-size:11px;font-weight:400;">(양산품)</span></div></div>
          <div class="hdiag-harrow">→</div>
          <div class="hdiag-branch">
            <div class="hdiag-branch-row">
              <div class="hdiag-node-box c-drv">서보 드라이버 1<br><span style="font-size:11px;font-weight:400;">(MEL서보)</span></div>
              <div class="hdiag-harrow">→</div>
              <div class="hdiag-node-box c-mtr">엔코더 모터 1<br><span style="font-size:11px;font-weight:400;">(AC 서보)</span></div>
              <div class="hdiag-harrow">→</div>
              <div class="hdiag-node-box c-stg">스테이지 1번 축</div>
            </div>
            <div class="hdiag-branch-row">
              <div class="hdiag-node-box c-drv">서보 드라이버 2<br><span style="font-size:11px;font-weight:400;">(MEL서보)</span></div>
              <div class="hdiag-harrow">→</div>
              <div class="hdiag-node-box c-mtr">엔코더 모터 2<br><span style="font-size:11px;font-weight:400;">(AC 서보)</span></div>
              <div class="hdiag-harrow">→</div>
              <div class="hdiag-node-box c-stg">스테이지 2번 축</div>
            </div>
          </div>
        </div>
      </div>
      <div class="hdiag-block">
        <div class="hdiag-block-title">▎ 소프트웨어 구성도</div>
        <div class="hdiag-vflow">
          <div class="hdiag-vnode">미쓰비시 서보 시스템 (하드웨어)</div>
          <div class="hdiag-varrow">↓</div>
          <div class="hdiag-vnode c-yellow">미쓰비시 제어 소프트웨어</div>
          <div class="hdiag-varrow">↓</div>
          <div class="hdiag-vnode">자체 개발 통신 인터페이스 / 프로토콜 모듈</div>
          <div class="hdiag-varrow">↓</div>
          <div class="hdiag-vnode">자체 개발 컨트롤러</div>
          <div class="hdiag-varrow">↓</div>
          <div class="hdiag-vnode c-yellow">PC 프로그램 연동</div>
        </div>

        <div class="mel-soft-wrap">
          <img class="mel-soft-image" src="${project.motionControlContent.melSoftwareImage}" alt="미쓰비시 제어프로그램 연동 화면">
          <div class="mel-soft-caption">미쓰비시 제어프로그램 연동</div>
          <div class="mel-soft-detail">모션 제어 (수동)</div>
          <div class="mel-soft-detail">JOG , ABS (절대위치 이동) 기능 연동</div>

          <div class="mel-soft-feature-title">기능 1 : 수동 제어. 외부 프로그램 기능을 자체 프로그램에 가져다 쓰는 방식</div>
          ${renderJogControlCard()}

          <div class="mel-soft-feature-title">기능 2 : 자동 제어. 1번 축과 2번 축을 동시에 제어</div>
          <div class="mel-soft-detail">레시피 설정하여 10,000회 이상 자동 반복 설정 가능</div>
          ${renderAutoControlCard()}

          <div class="mel-soft-feature-title">기능 3 : 반복 동작 후 데이터 분석 평가표를 EXCEL로 제공</div>
          <div class="mel-analysis-card">
            <div class="mel-analysis-header">
              <div>
                <h3 class="mel-analysis-title">기능 3. 반복 동작 데이터 분석 평가표</h3>
                <p class="mel-analysis-sub">반복 동작 이후 속도, 위치 편차, 딜레이 데이터를 분석하여 Excel 형식으로 제공합니다.</p>
              </div>
              <button id="excel-download-button" class="mel-excel-btn" type="button">Excel 다운로드 가능</button>
            </div>
            <div class="mel-analysis-body">
              <div class="mel-analysis-table-wrap">
                <table id="analysisTable" class="mel-analysis-table">
                  <thead>
                    <tr>
                      <th>반복 회차</th>
                      <th>시간</th>
                      <th>최저 속도</th>
                      <th>최대 속도</th>
                      <th>가속 시간</th>
                      <th>위치 편차</th>
                      <th>왕복 딜레이</th>
                      <th>평가</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${analysisTableRowsMarkup}
                  </tbody>
                </table>
              </div>
              <div class="mel-summary-box">
                <div class="mel-summary-title">분석 결과</div>
                ${project.motionControlContent.analysisSummary}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderJogControlCard() {
  return `
    <section class="jog-card">
      <header class="jog-header">
        <h1 class="jog-title">기능 1. 수동 제어 - JOG 운전</h1>
        <p class="jog-desc">외부 프로그램의 JOG 운전 기능을 자체 프로그램 UI에서 사용할 수 있도록 구성한 예시입니다. 속도, 운전 방향, 시작/정지 상태, 현재 위치를 실시간으로 확인할 수 있습니다.</p>
      </header>
      <main class="jog-body">
        <section class="jog-section-box">
          <div class="jog-section-title">수동 운전 설정</div>
          <div class="jog-section-content">
            <div class="jog-form-row">
              <label class="jog-form-label" for="jogAxisSelect">운전 축 선택</label>
              <select class="jog-select" id="jogAxisSelect">
                <option value="Z1">축 #1</option>
                <option value="Z2">축 #2</option>
              </select>
            </div>
            <div class="jog-form-row">
              <label class="jog-form-label" for="jogSpeedInput">속도 설정</label>
              <input class="jog-input" id="jogSpeedInput" type="number" value="100" min="0" max="1000">
            </div>
            <div class="jog-form-row">
              <span class="jog-form-label">운전 방향</span>
              <div class="jog-button-row">
                <button class="jog-button direction-button active" id="jogForwardButton" type="button">정방향</button>
                <button class="jog-button direction-button" id="jogReverseButton" type="button">역방향</button>
              </div>
            </div>
          </div>
        </section>
        <section class="jog-section-box">
          <div class="jog-section-title">JOG 운전 상태</div>
          <div class="jog-section-content">
            <div class="jog-status-panel">
              <div class="jog-status-item"><div class="jog-status-label">운전 상태</div><div class="jog-status-value status-run" id="jogStatus">READY</div></div>
              <div class="jog-status-item"><div class="jog-status-label">현재 속도</div><div class="jog-status-value" id="jogCurrentSpeed">0 r/min</div></div>
              <div class="jog-status-item"><div class="jog-status-label">선택 축</div><div class="jog-status-value" id="jogCurrentAxis">Z1</div></div>
              <div class="jog-status-item"><div class="jog-status-label">운전 방향</div><div class="jog-status-value" id="jogCurrentDirection">정방향</div></div>
            </div>
          </div>
        </section>
        <section class="jog-section-box jog-position-area">
          <div class="jog-section-title">현재 위치</div>
          <div class="jog-section-content">
            <div class="jog-position-number" id="jogCurrentPosition">+00000 pulse</div>
            <div class="jog-position-progress-wrap"><div class="jog-position-progress-bar" id="jogPositionProgressBar"></div></div>
            <div class="jog-range-labels"><span>-5000 pulse</span><span>0 pulse</span><span>+5000 pulse</span></div>
            <div class="jog-control-area">
              <div class="jog-control-guide">JOG는 누르는 동안만 이동하도록 구성하는 것이 안전하지만, 구현 편의상 버튼을 두 개 두었습니다.</div>
              <div class="jog-button-row">
                <button class="jog-button start-button" id="jogStartButton" type="button">JOG 운전 시작</button>
                <button class="jog-button stop-button" id="jogStopButton" type="button">JOG 운전 정지</button>
              </div>
            </div>
          </div>
        </section>
        <div class="jog-note-box">
          <div class="jog-note-title">참고</div>
          JOG 운전 시작 시 선택한 방향으로 위치값이 계속 증가 또는 감소합니다. 정지 버튼을 누르면 현재 위치에서 멈추고, 현재 속도는 0 r/min으로 변경됩니다.
        </div>
      </main>
    </section>
  `;
}

function renderAutoControlCard() {
  return `
    <section class="auto-control-card">
      <header class="auto-control-header">
        <h1 class="auto-control-title">기능 2. 자동 제어</h1>
        <p class="auto-control-desc">1번 축과 2번 축을 동시에 제어하며, 레시피 기반으로 상승/하강 위치와 속도 조건을 설정합니다. 반복 횟수는 10,000회 이상 자동 반복 설정이 가능합니다.</p>
      </header>
      <main class="auto-control-body">
        <div class="section-box">
          <div class="section-title">레시피 설정</div>
          <div class="section-content">
            <div class="recipe-grid">
              <label class="field-label">반복 횟수</label>
              <input class="field-input" id="repeatCountInput" type="number" value="10000">
              <label class="field-label">상승 위치</label>
              <input class="field-input" type="text" value="+5000 pulse">
              <label class="field-label">하강 위치</label>
              <input class="field-input" type="text" value="0 pulse">
              <label class="field-label">운전 속도</label>
              <input class="field-input" type="text" value="300 r/min">
              <label class="field-label">왕복 딜레이</label>
              <input class="field-input" type="text" value="120 ms">
            </div>
            <div class="note-box">
              <div class="note-title">제어 방식</div>
              설정된 레시피에 따라 Z1/Z2 두 축을 동시에 상승 이동 후, 엔코더 위치 확인이 완료되면 하강 이동을 수행합니다.
            </div>
          </div>
        </div>
        <div class="section-box">
          <div class="section-title">자동 반복 상태</div>
          <div class="section-content">
            <div class="status-panel">
              <div class="status-item"><div class="status-label">제어 상태</div><div class="status-value status-good" id="controlStatus">READY</div></div>
              <div class="status-item"><div class="status-label">현재 반복 횟수</div><div class="status-value" id="currentRepeatCount">0</div></div>
              <div class="status-item"><div class="status-label">Z1 위치</div><div class="status-value" id="z1Position">+00000</div></div>
              <div class="status-item"><div class="status-label">Z2 위치</div><div class="status-value" id="z2Position">+00000</div></div>
            </div>
            <div class="progress-wrap"><div class="progress-bar" id="progressBar"></div></div>
            <div class="button-row">
              <button class="control-button start-button" id="autoControlStartButton" type="button">자동 반복 시작</button>
              <button class="control-button stop-button" id="autoControlStopButton" type="button">정지</button>
            </div>
          </div>
        </div>
        <div class="section-box" style="grid-column:1/-1;">
          <div class="section-title">축 동시 제어 조건</div>
          <div class="section-content">
            <table class="axis-table">
              <thead>
                <tr>
                  <th>축</th>
                  <th>제어 대상</th>
                  <th>이동 방식</th>
                  <th>위치 확인</th>
                  <th>동기화 조건</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>1번 축</td><td>웨이퍼 스테이지 Z1</td><td>상대 위치 이동</td><td>엔코더 피드백</td><td>InPosition 확인</td></tr>
                <tr><td>2번 축</td><td>웨이퍼 스테이지 Z2</td><td>상대 위치 이동</td><td>엔코더 피드백</td><td>InPosition 확인</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </section>
  `;
}

function renderMotionControlFlowTab(project) {
  const flowDescriptionMarkup = project.motionControlContent.flowDescriptionSteps
    .map(
      (flowStep) => `
        <b>${flowStep.title}</b> — ${flowStep.description}<br>
      `
    )
    .join('');

  return `
    <div style="margin-bottom:16px;">
      <button id="openFlowModalButton" class="mfc-btn blue" type="button" style="font-size:15px;padding:10px 28px;">▶ 흐름도 보기</button>
    </div>
    <div style="border:2px solid #1565C0;border-radius:10px;padding:24px;background:#fafcff;">
      <div style="font-size:17px;font-weight:700;color:#1565C0;margin-bottom:16px;">동작 시퀀스 설명</div>
      <div style="font-size:15px;line-height:2.0;color:#222;">
        ${flowDescriptionMarkup}
      </div>
    </div>
  `;
}

function renderMotionSimulationSection() {
  return `
    <div class="rs-block" id="s-prog-z">
      <div class="rs-section-title">💻 프로그램 시뮬레이션</div>
      <div class="prog-sim-wrap">
        <div class="anim-panel-inner">
          <div style="font-size:15px;font-weight:700;color:#1565C0;letter-spacing:1px;">웨이퍼 Z축 스테이지 시뮬레이션</div>
          <svg id="stage-svg" viewBox="0 0 460 295" style="width:100%;max-width:520px;background:#fff;border:2.5px solid #1565C0;border-radius:10px;">
            <defs>
              <marker id="zaxarr" viewBox="0 0 10 10" refX="5" refY="1" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,10 L5,0 L10,10 Z" fill="#1565C0"/></marker>
              <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="#546e7a" stroke-width="1.5"/></pattern>
            </defs>
            <line x1="28" y1="258" x2="28" y2="38" stroke="#1565C0" stroke-width="2" marker-end="url(#zaxarr)"/>
            <text x="16" y="42" font-size="11" font-weight="700" fill="#1565C0" font-family="Noto Sans KR,sans-serif">+Z</text>
            <text x="18" y="268" font-size="11" font-weight="700" fill="#555" font-family="Noto Sans KR,sans-serif">0</text>
            <line x1="23" y1="88" x2="33" y2="88" stroke="#1565C0" stroke-width="1" stroke-dasharray="2,2"/>
            <line x1="23" y1="148" x2="33" y2="148" stroke="#1565C0" stroke-width="1" stroke-dasharray="2,2"/>
            <line x1="23" y1="208" x2="33" y2="208" stroke="#1565C0" stroke-width="1" stroke-dasharray="2,2"/>
            <text x="155" y="20" font-size="13" font-weight="900" fill="#1565C0" text-anchor="middle" font-family="Noto Sans KR,sans-serif">STAGE A</text>
            <rect x="82" y="248" width="146" height="22" rx="2" fill="#78909c"/>
            <rect x="82" y="248" width="146" height="22" rx="2" fill="url(#hatch)" opacity="0.3"/>
            <rect x="98" y="88" width="12" height="160" fill="#546e7a"/>
            <rect x="200" y="88" width="12" height="160" fill="#546e7a"/>
            <rect x="150" y="93" width="6" height="155" fill="#90a4ae"/>
            <g id="stageA-group" transform="translate(0,0)">
              <rect x="86" y="210" width="138" height="38" rx="3" fill="#b0bec5" stroke="#546e7a" stroke-width="1.5"/>
              <rect x="147" y="218" width="14" height="22" rx="2" fill="#78909c" stroke="#455a64" stroke-width="1"/>
              <rect x="78" y="191" width="154" height="19" rx="2" fill="#eceff1" stroke="#1565C0" stroke-width="2"/>
              <ellipse cx="155" cy="187" rx="64" ry="13" fill="#e3f2fd" stroke="#1565C0" stroke-width="2"/>
              <ellipse cx="155" cy="187" rx="46" ry="8.5" fill="none" stroke="#90caf9" stroke-width="1.2" stroke-dasharray="5,3"/>
              <circle cx="155" cy="187" r="3.5" fill="#1565C0" opacity="0.5"/>
            </g>
            <text x="315" y="20" font-size="13" font-weight="900" fill="#1565C0" text-anchor="middle" font-family="Noto Sans KR,sans-serif">STAGE B</text>
            <rect x="242" y="248" width="146" height="22" rx="2" fill="#78909c"/>
            <rect x="242" y="248" width="146" height="22" rx="2" fill="url(#hatch)" opacity="0.3"/>
            <rect x="258" y="88" width="12" height="160" fill="#546e7a"/>
            <rect x="360" y="88" width="12" height="160" fill="#546e7a"/>
            <rect x="310" y="93" width="6" height="155" fill="#90a4ae"/>
            <g id="stageB-group" transform="translate(0,0)">
              <rect x="246" y="210" width="138" height="38" rx="3" fill="#b0bec5" stroke="#546e7a" stroke-width="1.5"/>
              <rect x="307" y="218" width="14" height="22" rx="2" fill="#78909c" stroke="#455a64" stroke-width="1"/>
              <rect x="238" y="191" width="154" height="19" rx="2" fill="#eceff1" stroke="#1565C0" stroke-width="2"/>
              <ellipse cx="315" cy="187" rx="64" ry="13" fill="#e3f2fd" stroke="#1565C0" stroke-width="2"/>
              <ellipse cx="315" cy="187" rx="46" ry="8.5" fill="none" stroke="#90caf9" stroke-width="1.2" stroke-dasharray="5,3"/>
              <circle cx="315" cy="187" r="3.5" fill="#1565C0" opacity="0.5"/>
            </g>
            <rect x="50" y="276" width="360" height="14" rx="7" fill="#e0e0e0"/>
            <rect id="sync-bar" x="50" y="276" width="360" height="14" rx="7" fill="#66bb6a"/>
            <text id="sync-text" x="230" y="287" font-size="10" font-weight="700" fill="#fff" text-anchor="middle" font-family="Noto Sans KR,sans-serif">동기화 정상</text>
          </svg>
          <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap;justify-content:center;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:13px;font-weight:700;color:#555;">Z1</span>
              <span id="anim-pos-a" style="font-family:monospace;font-size:15px;font-weight:700;color:#1565C0;background:#e8f0fe;padding:3px 10px;border-radius:4px;">+00000</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:13px;font-weight:700;color:#555;">Z2</span>
              <span id="anim-pos-b" style="font-family:monospace;font-size:15px;font-weight:700;color:#1565C0;background:#e8f0fe;padding:3px 10px;border-radius:4px;">+00000</span>
            </div>
            <div id="anim-status-badge" style="padding:4px 16px;border-radius:5px;font-size:14px;font-weight:700;border:2px solid #aaa;color:#555;background:#fff;">● IDLE</div>
          </div>
        </div>

        <div class="prog-v-div"></div>

        <div class="ctrl-panel-inner">
          <div class="mfc-titlebar" style="font-size:13px;padding:6px 12px;">🖥️ Z축 제어 패널</div>
          <div style="flex:1;display:flex;flex-direction:column;padding:10px;gap:10px;overflow:hidden;">
            <div class="mfc-grp">
              <span class="mfc-grp-lbl">반복 조건</span>
              <div style="display:grid;grid-template-columns:auto 1fr;gap:6px 10px;align-items:center;margin-top:8px;">
                <span class="mfc-lbl" style="margin:0;">반복횟수 지정</span>
                <input class="mfc-input" type="number" value="5" min="1" max="99" id="rep-input" style="width:60px;">
                <span class="mfc-lbl" style="margin:0;">현재 반복횟수</span>
                <span class="mfc-led" id="rep-cur" style="font-size:15px;width:60px;">00</span>
              </div>
            </div>
            <div class="mfc-grp">
              <span class="mfc-grp-lbl">제어</span>
              <div style="display:flex;flex-direction:column;gap:7px;margin-top:8px;">
                <button class="mfc-btn green" id="simulationStartButton" type="button" style="font-size:15px;padding:10px;">▶ 반복 시작</button>
                <button class="mfc-btn red" id="simulationStopButton" type="button" style="font-size:15px;padding:10px;">■ 정지</button>
                <button class="mfc-btn" id="simulationErrorButton" type="button" style="font-size:14px;padding:9px;background:#5D4037;color:#fff;border-color:#a0522d #2c1a0e #2c1a0e #a0522d;">⚠ 오류 발생</button>
                <button class="mfc-btn" id="simulationHomeButton" type="button" style="font-size:13px;padding:8px;">↩ 원점 복귀</button>
              </div>
            </div>
            <div class="mfc-grp" style="flex:1;display:flex;flex-direction:column;min-height:0;">
              <span class="mfc-grp-lbl">동작 로그</span>
              <div class="mfc-log" id="log-box" style="flex:1;margin-top:6px;font-size:12px;">
                <span style="color:#aaa;">[시스템] 초기화 완료 — 원점 대기</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAutonomousDrivingSection(project) {
  const robotArmPhotosMarkup = project.autonomousDrivingContent.robotArm.photos
    .map(
      (photo) => `
        <div class="diag-photo">
          <img src="${photo.imagePath}" alt="${photo.alt}" style="mix-blend-mode:multiply;">
          <span>${photo.label}</span>
        </div>
      `
    )
    .join('');

  const robotLidarPhotosMarkup = project.autonomousDrivingContent.robotLidar.photos
    .map(
      (photo) => `
        <div class="diag-photo">
          <img src="${photo.imagePath}" alt="${photo.alt}" style="mix-blend-mode:multiply;">
          <span>${photo.label}</span>
        </div>
      `
    )
    .join('');

  return `
    <div class="rs-block" id="autonomous-driving-tab-section">
      <div class="rs-section-title">📐 구성도</div>
      <div class="tabs" data-tab-group-container="autonomous-driving-tabs">
        <div class="tab active" data-tab-button="true" data-tab-group="autonomous-driving-tabs" data-tab-target="autonomous-driving-tab-arm">로봇 팔 구성도</div>
        <div class="tab" data-tab-button="true" data-tab-group="autonomous-driving-tabs" data-tab-target="autonomous-driving-tab-lidar">라이다 구성도</div>
      </div>

      <div id="autonomous-driving-tab-arm" class="tab-pane active" data-tab-pane-group="autonomous-driving-tabs">
        <div class="diag-wrap">
          <div class="diag-spec">${project.autonomousDrivingContent.robotArm.specSummary}</div>
          <div class="diag-title">구성도</div>
          <div class="diag-row">
            <div style="display:flex;flex-direction:column;gap:10px;margin-right:0;">
              <div class="diag-node" style="background:#EBF5FF;min-width:130px;">보드<br>라즈베리5</div>
              <div style="display:flex;align-items:center;gap:0;padding-left:130px;">
                <div class="diag-node" style="min-width:130px;background:#f5f5f5;">와이파이</div>
              </div>
              <div class="diag-node" style="min-width:130px;background:#f5f5f5;">PC 프로그램<br>키보드 입력</div>
            </div>
            <span class="arr">→</span>
            <div class="diag-node">서보 모터</div>
            <span class="arr">→</span>
            <div class="diag-node">로봇 팔 (2축)<br>프로그램 연동</div>
            <span class="arr">→</span>
            <div class="diag-node">와이파이</div>
            <span class="arr">→</span>
            <div class="diag-node">자율주행차<br>PC 연동</div>
          </div>
          <div class="diag-photos">
            ${robotArmPhotosMarkup}
          </div>
        </div>
      </div>

      <div id="autonomous-driving-tab-lidar" class="tab-pane" data-tab-pane-group="autonomous-driving-tabs">
        <div class="diag-wrap">
          <div class="diag-spec">${project.autonomousDrivingContent.robotLidar.specSummary}</div>
          <div class="diag-title">구성도</div>
          <div class="diag-row">
            <div class="diag-node" style="background:#EBF5FF;min-width:120px;">2D 라이다<br>측정</div>
            <span class="arr">→</span>
            <div class="diag-node" style="min-width:100px;">시리얼</div>
            <span class="arr">→</span>
            <div class="diag-node" style="min-width:120px;">임베디드 PC</div>
            <span class="arr">→</span>
            <div class="diag-node" style="min-width:130px;">데이터 파싱<br>프로그램</div>
            <span class="arr">→</span>
            <div class="diag-node" style="min-width:120px;">자율주행차<br>연동</div>
          </div>
          <div class="diag-photos">
            ${robotLidarPhotosMarkup}
          </div>
        </div>
      </div>
    </div>

    <div class="rs-block" id="s-prog-robot" style="padding-bottom:60px;">
      <div class="rs-section-title">💻 프로그램</div>
      <div style="display:flex;align-items:center;justify-content:center;background:#fafcff;border:2px solid #e0eaf6;border-radius:10px;padding:60px 20px;">
        <div style="text-align:center;color:#aaa;">
          <div style="font-size:60px;margin-bottom:16px;">🛠️</div>
          <div style="font-size:22px;font-weight:700;color:#1565C0;">준비 중입니다</div>
          <div style="font-size:16px;margin-top:8px;">프로그램 화면이 곧 추가됩니다.</div>
        </div>
      </div>
    </div>
  `;
}

function renderFlowModal() {
  const flowModalContainerElement = document.querySelector(FLOW_MODAL_CONTAINER_SELECTOR);

  if (!flowModalContainerElement) {
    return;
  }

  flowModalContainerElement.innerHTML = `
    <div id="flowModalOverlay" class="pop-overlay" aria-hidden="true">
      <div class="pop-box">
        <button id="closeFlowModalButton" class="pop-close" type="button">✕</button>
        <div class="pop-title">웨이퍼 Z축 — 동작 흐름도 (Sequence Flow)</div>
        <svg viewBox="0 0 1920 300" xmlns="http://www.w3.org/2000/svg" style="font-family:'Noto Sans KR',sans-serif;display:block;">
          <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 Z" fill="#1565C0"/></marker></defs>
          <rect x="10" y="112" width="95" height="75" rx="8" fill="#1565C0" stroke="#1565C0" stroke-width="2"/>
          <text x="57" y="157" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">START</text>
          <line x1="105" y1="149" x2="123" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="125" y="112" width="110" height="75" rx="6" fill="#fff" stroke="#1565C0" stroke-width="2"/>
          <text x="180" y="157" text-anchor="middle" fill="#111" font-size="15" font-weight="700">Servo ON</text>
          <line x1="235" y1="149" x2="253" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="255" y="112" width="115" height="75" rx="6" fill="#fff" stroke="#1565C0" stroke-width="2"/>
          <text x="312" y="157" text-anchor="middle" fill="#111" font-size="15" font-weight="700">Home Move</text>
          <line x1="370" y1="149" x2="388" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="390" y="112" width="140" height="75" rx="6" fill="#fff" stroke="#1565C0" stroke-width="2"/>
          <text x="460" y="141" text-anchor="middle" fill="#111" font-size="14" font-weight="700">Wait Home</text>
          <text x="460" y="161" text-anchor="middle" fill="#111" font-size="14" font-weight="700">Complete</text>
          <line x1="530" y1="149" x2="548" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="550" y="112" width="135" height="75" rx="6" fill="#EBF5FF" stroke="#1565C0" stroke-width="2.5"/>
          <text x="617" y="141" text-anchor="middle" fill="#1565C0" font-size="14" font-weight="900">Auto Cycle</text>
          <text x="617" y="161" text-anchor="middle" fill="#1565C0" font-size="14" font-weight="900">Start</text>
          <line x1="685" y1="149" x2="703" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="705" y="112" width="115" height="75" rx="6" fill="#fff" stroke="#1565C0" stroke-width="2"/>
          <text x="762" y="146" text-anchor="middle" fill="#111" font-size="14" font-weight="700">Move Z Up</text>
          <text x="762" y="165" text-anchor="middle" fill="#555" font-size="12">(상대위치)</text>
          <line x1="820" y1="149" x2="838" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="840" y="112" width="130" height="75" rx="6" fill="#fff" stroke="#1565C0" stroke-width="2"/>
          <text x="905" y="141" text-anchor="middle" fill="#111" font-size="13" font-weight="700">Encoder Pos</text>
          <text x="905" y="161" text-anchor="middle" fill="#111" font-size="13" font-weight="700">Polling</text>
          <line x1="970" y1="149" x2="988" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="990" y="112" width="130" height="75" rx="6" fill="#fff" stroke="#1565C0" stroke-width="2"/>
          <text x="1055" y="141" text-anchor="middle" fill="#111" font-size="13" font-weight="700">Z1/Z2</text>
          <text x="1055" y="161" text-anchor="middle" fill="#111" font-size="13" font-weight="700">InPos Check</text>
          <line x1="1120" y1="149" x2="1138" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="1140" y="112" width="90" height="75" rx="6" fill="#fff" stroke="#1565C0" stroke-width="2"/>
          <text x="1185" y="157" text-anchor="middle" fill="#111" font-size="15" font-weight="700">Delay</text>
          <line x1="1230" y1="149" x2="1248" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="1250" y="112" width="120" height="75" rx="6" fill="#fff" stroke="#1565C0" stroke-width="2"/>
          <text x="1310" y="157" text-anchor="middle" fill="#111" font-size="13" font-weight="700">Move Z Down</text>
          <line x1="1370" y1="149" x2="1388" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="1390" y="112" width="125" height="75" rx="6" fill="#fff" stroke="#1565C0" stroke-width="2"/>
          <text x="1452" y="141" text-anchor="middle" fill="#111" font-size="13" font-weight="700">엔코더 위치</text>
          <text x="1452" y="161" text-anchor="middle" fill="#111" font-size="13" font-weight="700">피드백</text>
          <line x1="1515" y1="149" x2="1533" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <rect x="1535" y="112" width="120" height="75" rx="6" fill="#fff" stroke="#1565C0" stroke-width="2"/>
          <text x="1595" y="141" text-anchor="middle" fill="#111" font-size="13" font-weight="700">반복횟수</text>
          <text x="1595" y="161" text-anchor="middle" fill="#111" font-size="13" font-weight="700">증가 ++</text>
          <line x1="1655" y1="149" x2="1673" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <polygon points="1740,94 1805,149 1740,204 1675,149" fill="#FFF8E1" stroke="#1565C0" stroke-width="2.5"/>
          <text x="1740" y="141" text-anchor="middle" fill="#111" font-size="12" font-weight="700">반복 횟수</text>
          <text x="1740" y="161" text-anchor="middle" fill="#111" font-size="12" font-weight="700">도달 여부?</text>
          <line x1="1805" y1="149" x2="1823" y2="149" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <text x="1808" y="140" fill="#006400" font-size="13" font-weight="700">Yes</text>
          <rect x="1825" y="112" width="90" height="75" rx="8" fill="#1565C0" stroke="#1565C0" stroke-width="2"/>
          <text x="1870" y="157" text-anchor="middle" fill="#fff" font-size="16" font-weight="700">완료</text>
          <line x1="1740" y1="204" x2="1740" y2="258" stroke="#1565C0" stroke-width="2"/>
          <line x1="1740" y1="258" x2="617" y2="258" stroke="#1565C0" stroke-width="2"/>
          <line x1="617" y1="258" x2="617" y2="190" stroke="#1565C0" stroke-width="2" marker-end="url(#arr)"/>
          <text x="1180" y="250" text-anchor="middle" fill="#c62828" font-size="13" font-weight="700">No → 다음 반복 시작</text>
        </svg>
        <div class="flow-vlist">
          <div class="fvl-step fvl-start">START</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step">Servo ON</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step">Home Move</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step">Wait Home Complete</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step fvl-hl">Auto Cycle Start</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step">Move Z Up <span style="font-size:12px;font-weight:400;color:#777;">(상대위치)</span></div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step">Encoder Pos Polling</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step">Z1/Z2 InPos Check</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step">Delay</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step">Move Z Down</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step">엔코더 위치 피드백</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-step">반복횟수 증가 ++</div>
          <div class="fvl-arr">↓</div>
          <div class="fvl-diamond-wrap">
            <div class="fvl-diamond-box"><div class="fvl-diamond-txt">반복 횟수<br>도달?</div></div>
          </div>
          <div class="fvl-arr">↓ Yes</div>
          <div class="fvl-step fvl-end">완료</div>
          <div class="fvl-note">↩ No → Auto Cycle Start 부터 재시작</div>
        </div>
      </div>
    </div>
  `;
}

function initializeProjectNavigation() {
  const projectRowElements = document.querySelectorAll('[data-scroll-target]');

  projectRowElements.forEach((projectRowElement) => {
    projectRowElement.addEventListener('click', () => {
      const targetSectionIdentifier = projectRowElement.dataset.scrollTarget;
      scrollToSection(targetSectionIdentifier);
    });

    projectRowElement.addEventListener('keydown', (keyboardEvent) => {
      if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
        keyboardEvent.preventDefault();
        const targetSectionIdentifier = projectRowElement.dataset.scrollTarget;
        scrollToSection(targetSectionIdentifier);
      }
    });
  });
}

function scrollToSection(sectionIdentifier) {
  const sectionElement = document.getElementById(sectionIdentifier);

  if (sectionElement) {
    sectionElement.scrollIntoView({ behavior: 'smooth' });
  }
}

function initializeTabs() {
  const tabButtonElements = document.querySelectorAll('[data-tab-button]');

  tabButtonElements.forEach((tabButtonElement) => {
    tabButtonElement.addEventListener('click', () => {
      switchTab(tabButtonElement);
    });
  });
}

function switchTab(tabButtonElement) {
  const tabGroupName = tabButtonElement.dataset.tabGroup;
  const targetTabPaneIdentifier = tabButtonElement.dataset.tabTarget;

  if (!tabGroupName || !targetTabPaneIdentifier) {
    return;
  }

  const tabButtonElements = document.querySelectorAll(`[data-tab-group="${tabGroupName}"]`);
  const tabPaneElements = document.querySelectorAll(`[data-tab-pane-group="${tabGroupName}"]`);

  tabButtonElements.forEach((buttonElement) => buttonElement.classList.remove('active'));
  tabPaneElements.forEach((paneElement) => paneElement.classList.remove('active'));

  tabButtonElement.classList.add('active');

  const targetTabPaneElement = document.getElementById(targetTabPaneIdentifier);

  if (targetTabPaneElement) {
    targetTabPaneElement.classList.add('active');
  }
}

function initializeFlowModal() {
  const openFlowModalButtonElement = document.getElementById('openFlowModalButton');
  const closeFlowModalButtonElement = document.getElementById('closeFlowModalButton');
  const flowModalOverlayElement = document.getElementById('flowModalOverlay');

  if (openFlowModalButtonElement && flowModalOverlayElement) {
    openFlowModalButtonElement.addEventListener('click', () => {
      flowModalOverlayElement.classList.add('open');
      flowModalOverlayElement.setAttribute('aria-hidden', 'false');
    });
  }

  if (closeFlowModalButtonElement && flowModalOverlayElement) {
    closeFlowModalButtonElement.addEventListener('click', () => {
      flowModalOverlayElement.classList.remove('open');
      flowModalOverlayElement.setAttribute('aria-hidden', 'true');
    });
  }

  if (flowModalOverlayElement) {
    flowModalOverlayElement.addEventListener('click', (mouseEvent) => {
      if (mouseEvent.target === flowModalOverlayElement) {
        flowModalOverlayElement.classList.remove('open');
        flowModalOverlayElement.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

function initializeSystemDiagramAnimation() {
  const systemDiagramFlowElements = document.querySelectorAll('[data-animated-flow]');

  systemDiagramFlowElements.forEach((systemDiagramFlowElement) => {
    let hasAnimationTriggered = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimationTriggered) {
          hasAnimationTriggered = true;
          animateSystemDiagram(systemDiagramFlowElement);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(systemDiagramFlowElement);
  });
}

function animateSystemDiagram(systemDiagramFlowElement) {
  const animatedElements = systemDiagramFlowElement.querySelectorAll('.sysdiag-node, .sysdiag-arr');

  animatedElements.forEach((animatedElement) => {
    animatedElement.classList.remove('sd-vis');
  });

  animatedElements.forEach((animatedElement, index) => {
    setTimeout(() => {
      animatedElement.classList.add('sd-vis');
    }, index * simulationSettings.simulationIntervalMilliseconds);
  });
}

function initializeSimulation() {
  const simulationStartButtonElement = document.getElementById('simulationStartButton');
  const simulationStopButtonElement = document.getElementById('simulationStopButton');
  const simulationErrorButtonElement = document.getElementById('simulationErrorButton');
  const simulationHomeButtonElement = document.getElementById('simulationHomeButton');

  if (simulationStartButtonElement) {
    simulationStartButtonElement.addEventListener('click', startSimulationCycle);
  }

  if (simulationStopButtonElement) {
    simulationStopButtonElement.addEventListener('click', stopSimulationCycle);
  }

  if (simulationErrorButtonElement) {
    simulationErrorButtonElement.addEventListener('click', triggerSimulationError);
  }

  if (simulationHomeButtonElement) {
    simulationHomeButtonElement.addEventListener('click', resetSimulationToHome);
  }

  renderSimulationStages();
}

function addSimulationLogMessage(messageHtml) {
  const simulationLogBoxElement = document.getElementById('log-box');

  if (!simulationLogBoxElement) {
    return;
  }

  const timestampText = new Date().toTimeString().slice(0, 8);
  simulationLogBoxElement.innerHTML += `<br><span style="color:#aaa;">[${timestampText}]</span> ${messageHtml}`;
  simulationLogBoxElement.scrollTop = simulationLogBoxElement.scrollHeight;
}

function animateSimulationFrame(timestamp) {
  // requestAnimationFrame loop for two-stage synchronization animation
  if (!simulationState.isRunning) {
    return;
  }

  if (!simulationState.lastAnimationTimestamp) {
    simulationState.lastAnimationTimestamp = timestamp;
    requestAnimationFrame(animateSimulationFrame);
    return;
  }

  const elapsedSeconds = Math.min(
    (timestamp - simulationState.lastAnimationTimestamp) / 1000,
    simulationSettings.frameDeltaCap
  );

  simulationState.lastAnimationTimestamp = timestamp;

  const stageASpeed = simulationSettings.normalSpeed;
  const stageBSpeed = simulationState.hasError
    ? simulationSettings.errorSpeed
    : simulationSettings.normalSpeed;

  simulationState.stageAPositionRatio += simulationState.stageADirection * stageASpeed * elapsedSeconds;

  if (simulationState.stageAPositionRatio >= 1) {
    simulationState.stageAPositionRatio = 1;
    simulationState.stageADirection = -1;
  }

  if (simulationState.stageAPositionRatio <= 0 && simulationState.stageADirection === -1) {
    simulationState.stageAPositionRatio = 0;
    simulationState.stageADirection = 1;
    simulationState.completedRepeatCount += 1;

    const repeatCountElement = document.getElementById('rep-cur');
    if (repeatCountElement) {
      repeatCountElement.textContent = String(simulationState.completedRepeatCount).padStart(2, '0');
    }

    const errorTagHtml = simulationState.hasError
      ? ' <span style="color:#ffcc00">⚠ 오류모드</span>'
      : '';

    addSimulationLogMessage(
      `반복 ${simulationState.completedRepeatCount}/${simulationState.targetRepeatCount} 완료${errorTagHtml}`
    );

    if (simulationState.completedRepeatCount >= simulationState.targetRepeatCount) {
      simulationState.isRunning = false;
      simulationState.stageBPositionRatio = 0;
      simulationState.stageBDirection = 1;

      renderSimulationStages();
      setSimulationStatusBadge('DONE', '#1565C0');
      addSimulationLogMessage('<span style="color:#00ff41;">✔ 사이클 완료 (Complete)</span>');
      return;
    }
  }

  simulationState.stageBPositionRatio += simulationState.stageBDirection * stageBSpeed * elapsedSeconds;

  if (simulationState.stageBPositionRatio >= 1) {
    simulationState.stageBPositionRatio = 1;
    simulationState.stageBDirection = -1;
  }

  if (simulationState.stageBPositionRatio <= 0 && simulationState.stageBDirection === -1) {
    simulationState.stageBPositionRatio = 0;
    simulationState.stageBDirection = 1;
  }

  renderSimulationStages();
  requestAnimationFrame(animateSimulationFrame);
}

function renderSimulationStages() {
  // Render current stage position, pulse values, and sync status
  const stageATranslateY = -(simulationSettings.maximumTravel * simulationState.stageAPositionRatio);
  const stageBTranslateY = -(simulationSettings.maximumTravel * simulationState.stageBPositionRatio);

  const stageAGroupElement = document.getElementById('stageA-group');
  const stageBGroupElement = document.getElementById('stageB-group');

  if (stageAGroupElement) {
    stageAGroupElement.setAttribute('transform', `translate(0,${stageATranslateY.toFixed(2)})`);
  }

  if (stageBGroupElement) {
    stageBGroupElement.setAttribute('transform', `translate(0,${stageBTranslateY.toFixed(2)})`);
  }

  const stageAPulse = Math.round(simulationState.stageAPositionRatio * simulationSettings.maximumPulse);
  const stageBPulse = Math.round(simulationState.stageBPositionRatio * simulationSettings.maximumPulse);

  const stageAPulseElement = document.getElementById('anim-pos-a');
  const stageBPulseElement = document.getElementById('anim-pos-b');

  if (stageAPulseElement) {
    stageAPulseElement.textContent = `+${String(stageAPulse).padStart(5, '0')}`;
  }

  if (stageBPulseElement) {
    stageBPulseElement.textContent = `+${String(stageBPulse).padStart(5, '0')}`;
  }

  const differenceRatio = Math.abs(
    simulationState.stageAPositionRatio - simulationState.stageBPositionRatio
  );

  const synchronizationRatio = Math.max(0, 1 - differenceRatio * 2.5);
  const hueValue = Math.round(synchronizationRatio * 120);
  const barColor = simulationState.hasError
    ? `hsl(${hueValue},80%,38%)`
    : '#4caf50';

  const synchronizationBarElement = document.getElementById('sync-bar');
  const synchronizationTextElement = document.getElementById('sync-text');

  if (synchronizationBarElement) {
    const widthValue = Math.round(
      simulationSettings.syncBarMaxWidth *
        Math.max(synchronizationRatio, simulationSettings.minimumSyncBarWidth)
    );

    synchronizationBarElement.setAttribute('width', widthValue);
    synchronizationBarElement.setAttribute('fill', barColor);
  }

  if (synchronizationTextElement) {
    synchronizationTextElement.textContent = simulationState.hasError
      ? `동기화 오차: ${Math.round(differenceRatio * simulationSettings.maximumPulse)}p`
      : '동기화 정상';
  }
}

function setSimulationStatusBadge(labelText, colorValue) {
  const statusBadgeElement = document.getElementById('anim-status-badge');

  if (!statusBadgeElement) {
    return;
  }

  statusBadgeElement.textContent = `● ${labelText}`;
  statusBadgeElement.style.borderColor = colorValue;
  statusBadgeElement.style.color = colorValue;
}

function startSimulationCycle() {
  if (simulationState.isRunning) {
    return;
  }

  const repeatInputElement = document.getElementById('rep-input');
  const repeatCountElement = document.getElementById('rep-cur');
  const stageSvgElement = document.getElementById('stage-svg');

  simulationState.targetRepeatCount = repeatInputElement
    ? Number.parseInt(repeatInputElement.value, 10) || 5
    : 5;

  simulationState.completedRepeatCount = 0;
  simulationState.stageAPositionRatio = 0;
  simulationState.stageBPositionRatio = 0;
  simulationState.stageADirection = 1;
  simulationState.stageBDirection = 1;
  simulationState.hasError = false;
  simulationState.isRunning = true;
  simulationState.lastAnimationTimestamp = null;

  if (repeatCountElement) {
    repeatCountElement.textContent = '00';
  }

  if (stageSvgElement) {
    stageSvgElement.style.borderColor = '#1565C0';
    stageSvgElement.style.boxShadow = 'none';
  }

  setSimulationStatusBadge('RUN', '#ff9900');
  addSimulationLogMessage(
    `<span style="color:#00ff41;">▶ 반복 시작 — 목표: ${simulationState.targetRepeatCount}회</span>`
  );

  requestAnimationFrame(animateSimulationFrame);
}

function stopSimulationCycle() {
  simulationState.isRunning = false;
  setSimulationStatusBadge('STOP', '#f44336');
  addSimulationLogMessage('<span style="color:#ff4444;">■ 정지</span>');
}

function triggerSimulationError() {
  if (!simulationState.isRunning) {
    addSimulationLogMessage(
      '<span style="color:#ffcc00;">⚠ 먼저 반복 시작을 눌러주세요</span>'
    );
    return;
  }

  simulationState.hasError = true;
  setSimulationStatusBadge('ERROR', '#f44336');

  const stageSvgElement = document.getElementById('stage-svg');

  if (stageSvgElement) {
    stageSvgElement.style.borderColor = '#f44336';
    stageSvgElement.style.boxShadow = '0 0 18px 4px rgba(244,67,54,0.4)';

    setTimeout(() => {
      stageSvgElement.style.borderColor = '#1565C0';
      stageSvgElement.style.boxShadow = 'none';
    }, simulationSettings.stageResetHighlightMilliseconds);
  }

  addSimulationLogMessage(
    '<span style="color:#ffcc00;">⚠ 오류 발생 — STAGE B 속도 저하 감지 (동기화 오차 증가 중)</span>'
  );
}

function resetSimulationToHome() {
  simulationState.isRunning = false;
  simulationState.hasError = false;
  simulationState.stageAPositionRatio = 0;
  simulationState.stageBPositionRatio = 0;
  simulationState.stageADirection = 1;
  simulationState.stageBDirection = 1;
  simulationState.completedRepeatCount = 0;

  renderSimulationStages();

  const repeatCountElement = document.getElementById('rep-cur');
  if (repeatCountElement) {
    repeatCountElement.textContent = '00';
  }

  const stageSvgElement = document.getElementById('stage-svg');
  if (stageSvgElement) {
    stageSvgElement.style.borderColor = '#1565C0';
    stageSvgElement.style.boxShadow = 'none';
  }

  setSimulationStatusBadge('IDLE', '#555');
  addSimulationLogMessage('원점 복귀 완료 — Z1: +00000 / Z2: +00000');
}

function initializeAutoControl() {
  const autoControlStartButtonElement = document.getElementById('autoControlStartButton');
  const autoControlStopButtonElement = document.getElementById('autoControlStopButton');

  if (autoControlStartButtonElement) {
    autoControlStartButtonElement.addEventListener('click', startAutoControl);
  }

  if (autoControlStopButtonElement) {
    autoControlStopButtonElement.addEventListener('click', stopAutoControl);
  }
}

function startAutoControl() {
  // Fake cycle data generation for UI demo
  const repeatCountInputElement = document.getElementById('repeatCountInput');
  const currentRepeatCountElement = document.getElementById('currentRepeatCount');
  const controlStatusElement = document.getElementById('controlStatus');
  const progressBarElement = document.getElementById('progressBar');
  const z1PositionElement = document.getElementById('z1Position');
  const z2PositionElement = document.getElementById('z2Position');

  if (
    !repeatCountInputElement ||
    !currentRepeatCountElement ||
    !controlStatusElement ||
    !progressBarElement ||
    !z1PositionElement ||
    !z2PositionElement
  ) {
    return;
  }

  const targetRepeatCount = Number(repeatCountInputElement.value) || 0;

  if (targetRepeatCount <= 0) {
    return;
  }

  autoControlState.currentRepeatCount = 0;
  currentRepeatCountElement.textContent = '0';
  controlStatusElement.textContent = 'RUN';
  progressBarElement.style.width = '0%';
  z1PositionElement.textContent = '+00000';
  z2PositionElement.textContent = '+00000';

  clearInterval(autoControlState.timerIdentifier);

  autoControlState.timerIdentifier = setInterval(() => {
    autoControlState.currentRepeatCount += autoControlState.increaseStep;

    const cyclePosition = autoControlState.currentRepeatCount % 1000;
    const basePositionValue =
      cyclePosition <= 500 ? cyclePosition * 10 : (1000 - cyclePosition) * 10;

    z1PositionElement.textContent = `+${String(basePositionValue).padStart(5, '0')}`;
    z2PositionElement.textContent = `+${String(
      basePositionValue + Math.floor(Math.random() * 5)
    ).padStart(5, '0')}`;

    if (autoControlState.currentRepeatCount >= targetRepeatCount) {
      autoControlState.currentRepeatCount = targetRepeatCount;
      z1PositionElement.textContent = '+00000';
      z2PositionElement.textContent = '+00000';
      clearInterval(autoControlState.timerIdentifier);
      controlStatusElement.textContent = 'COMPLETE';
    }

    currentRepeatCountElement.textContent = autoControlState.currentRepeatCount.toLocaleString();
    progressBarElement.style.width = `${
      (autoControlState.currentRepeatCount / targetRepeatCount) * 100
    }%`;
  }, autoControlState.intervalMilliseconds);
}

function stopAutoControl() {
  const controlStatusElement = document.getElementById('controlStatus');
  clearInterval(autoControlState.timerIdentifier);

  if (controlStatusElement) {
    controlStatusElement.textContent = 'STOP';
  }
}

function initializeJogControl() {
  const jogForwardButtonElement = document.getElementById('jogForwardButton');
  const jogReverseButtonElement = document.getElementById('jogReverseButton');
  const jogStartButtonElement = document.getElementById('jogStartButton');
  const jogStopButtonElement = document.getElementById('jogStopButton');

  if (jogForwardButtonElement) {
    jogForwardButtonElement.addEventListener('click', () => {
      setJogDirection('forward');
    });
  }

  if (jogReverseButtonElement) {
    jogReverseButtonElement.addEventListener('click', () => {
      setJogDirection('reverse');
    });
  }

  if (jogStartButtonElement) {
    jogStartButtonElement.addEventListener('click', startFeatureJog);
  }

  if (jogStopButtonElement) {
    jogStopButtonElement.addEventListener('click', stopFeatureJog);
  }
}

function setJogDirection(direction) {
  const jogForwardButtonElement = document.getElementById('jogForwardButton');
  const jogReverseButtonElement = document.getElementById('jogReverseButton');
  const jogCurrentDirectionElement = document.getElementById('jogCurrentDirection');

  if (!jogForwardButtonElement || !jogReverseButtonElement || !jogCurrentDirectionElement) {
    return;
  }

  jogControlState.direction = direction;

  if (direction === 'forward') {
    jogForwardButtonElement.classList.add('active');
    jogReverseButtonElement.classList.remove('active');
    jogCurrentDirectionElement.textContent = '정방향';
  } else {
    jogForwardButtonElement.classList.remove('active');
    jogReverseButtonElement.classList.add('active');
    jogCurrentDirectionElement.textContent = '역방향';
  }
}

function startFeatureJog() {
  // Validate input and start interval-based position update
  const jogSpeedInputElement = document.getElementById('jogSpeedInput');
  const jogAxisSelectElement = document.getElementById('jogAxisSelect');
  const jogCurrentSpeedElement = document.getElementById('jogCurrentSpeed');
  const jogCurrentAxisElement = document.getElementById('jogCurrentAxis');
  const jogStatusElement = document.getElementById('jogStatus');

  if (
    !jogSpeedInputElement ||
    !jogAxisSelectElement ||
    !jogCurrentSpeedElement ||
    !jogCurrentAxisElement ||
    !jogStatusElement
  ) {
    return;
  }

  const speedValue = Number(jogSpeedInputElement.value);

  if (speedValue <= 0) {
    jogStatusElement.textContent = 'SPEED ERR';
    jogCurrentSpeedElement.textContent = '0 r/min';
    return;
  }

  clearInterval(jogControlState.timerIdentifier);

  jogCurrentSpeedElement.textContent = `${speedValue} r/min`;
  jogCurrentAxisElement.textContent = jogAxisSelectElement.value;
  jogStatusElement.textContent = 'JOG RUN';

  jogControlState.timerIdentifier = setInterval(() => {
    moveFeatureJogPosition(speedValue);
  }, jogControlState.updateIntervalMilliseconds);
}

function stopFeatureJog() {
  const jogCurrentSpeedElement = document.getElementById('jogCurrentSpeed');
  const jogStatusElement = document.getElementById('jogStatus');

  clearInterval(jogControlState.timerIdentifier);

  if (jogCurrentSpeedElement) {
    jogCurrentSpeedElement.textContent = '0 r/min';
  }

  if (jogStatusElement) {
    jogStatusElement.textContent = 'STOP';
  }
}

function moveFeatureJogPosition(speedValue) {
  const stepValue = Math.max(1, Math.round(speedValue / 10));

  jogControlState.currentPosition +=
    jogControlState.direction === 'forward' ? stepValue : -stepValue;

  if (jogControlState.currentPosition >= jogControlState.maximumPosition) {
    jogControlState.currentPosition = jogControlState.maximumPosition;
    stopFeatureJog();
  }

  if (jogControlState.currentPosition <= jogControlState.minimumPosition) {
    jogControlState.currentPosition = jogControlState.minimumPosition;
    stopFeatureJog();
  }

  renderJogCurrentPosition();
}

function renderJogCurrentPosition() {
  const jogCurrentPositionElement = document.getElementById('jogCurrentPosition');
  const jogPositionProgressBarElement = document.getElementById('jogPositionProgressBar');

  if (!jogCurrentPositionElement || !jogPositionProgressBarElement) {
    return;
  }

  const absolutePositionText = Math.abs(jogControlState.currentPosition)
    .toString()
    .padStart(5, '0');

  const signText = jogControlState.currentPosition >= 0 ? '+' : '-';

  jogCurrentPositionElement.textContent = `${signText}${absolutePositionText} pulse`;

  const positionRange = jogControlState.maximumPosition - jogControlState.minimumPosition;
  const positionProgressPercentage =
    ((jogControlState.currentPosition - jogControlState.minimumPosition) / positionRange) * 100;

  jogPositionProgressBarElement.style.width = `${positionProgressPercentage}%`;
}

function initializeExcelDownload() {
  const excelDownloadButtonElement = document.getElementById('excel-download-button');

  if (!excelDownloadButtonElement) {
    return;
  }

  excelDownloadButtonElement.addEventListener('click', downloadExcelFile);
}

function downloadExcelFile() {
  // Export table HTML as an Excel-compatible file
  const analysisTableElement = document.getElementById('analysisTable');

  if (!analysisTableElement) {
    return;
  }

  const excelBlob = new Blob(
    [`<html><head><meta charset="UTF-8"></head><body>${analysisTableElement.outerHTML}</body></html>`],
    { type: 'application/vnd.ms-excel' }
  );

  const temporaryDownloadLinkElement = document.createElement('a');
  temporaryDownloadLinkElement.href = URL.createObjectURL(excelBlob);
  temporaryDownloadLinkElement.download = '반복_동작_데이터_분석_평가표.xls';

  document.body.appendChild(temporaryDownloadLinkElement);
  temporaryDownloadLinkElement.click();
  document.body.removeChild(temporaryDownloadLinkElement);
}
