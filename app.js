/* ==========================================================================
   自費診療 請求書・見積書作成システム JSロジック (app.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 定数 & プリセット定義 ---
  const PRESET_ITEMS = [
    { category: '補綴', name: 'セラミッククラウン', warranty: '5年保証', price: 100000, note: '金属不使用、天然歯に近い透明感のセラミック' },
    { category: '補綴', name: 'ジルコニアクラウン', warranty: '5年保証', price: 110000, note: '高強度・審美性に優れたフルジルコニアクラウン' },
    { category: '審美', name: 'ホワイトニング', warranty: '保証なし', price: 30000, note: '歯科医院にて行うオフィスホワイトニング（1回）' },
    { category: 'インプラント', name: 'インプラント治療', warranty: '10年保証', price: 350000, note: 'インプラント埋入手術＋上部構造' },
    { category: '矯正', name: '矯正治療', warranty: '保証なし', price: 800000, note: '全顎マウスピースまたはワイヤーによる矯正治療' },
    { category: '保存', name: 'メンテナンス', warranty: '保証なし', price: 5000, note: '定期検診および専門的な歯面清掃' },
    { category: 'その他', name: 'その他自費診療', warranty: '保証なし', price: 10000, note: 'その他、自費の治療項目' }
  ];

  const NOTE_TEMPLATES = {
    standard: `※自費診療（自由診療）は医療費控除の対象となる場合がございます。
当院発行の領収書は医療費控除の申告の際に必要となりますので、大切に保管してください（再発行は致しかねます）。
※本提示額は現時点での治療計画に基づく目安であり、治療の進行状況により変更となる場合があります。`,
    none: '',
    custom: 'ここに特記事項を自由に入力してください。'
  };

  const DEFAULT_PAYMENT_INFO = `現金、窓口での各種クレジットカード（一括・分割）、デンタルローン、または指定口座への銀行振込がご利用いただけます。
※銀行振込の手数料はお客様負担となりますのでご了承ください。`;

  // --- アプリケーションステート ---
  let state = {
    clinicInfo: {
      name: 'あおぞら歯科クリニック',
      zip: '107-0062',
      address: '東京都港区南青山1-2-3 青山ビル2F',
      tel: '03-1234-5678',
      invoiceNo: 'T1234567890123',
      bankName: 'ひまわり銀行',
      bankBranch: '本店営業部',
      bankType: '普通',
      bankNo: '1234567',
      bankOwner: 'イリョウホウジン アオゾラシカ',
      stampType: 'auto', // 'auto' | 'upload' | 'none'
      stampText: 'あおぞら歯科クリニック印',
      stampImage: '' // Base64 image string
    },
    currentDoc: {
      type: 'invoice', // 'invoice' | 'estimate'
      id: '',
      issueDate: '',
      dueDate: '',
      patientId: '',
      patientName: '',
      items: [], // { id, category, name, warranty, quantity, price, note }
      taxMode: 'exclusive', // 'inclusive' | 'exclusive'
      taxRate: 0.10,
      discount: 0,
      adjustment: 0,
      deposit: 0,
      notes: '',
      paymentInfo: ''
    },
    history: []
  };

  // --- DOM要素の取得 ---
  const elApp = document.getElementById('app');
  
  // ナビゲーション・操作
  const rdoDocTypeInvoice = document.getElementById('type-invoice');
  const rdoDocTypeEstimate = document.getElementById('type-estimate');
  const rdoModeEdit = document.getElementById('mode-edit');
  const rdoModePreview = document.getElementById('mode-preview');
  const btnPrint = document.getElementById('btn-print');
  const btnPrintPreview = document.getElementById('btn-print-preview');
  const btnBackEdit = document.getElementById('btn-back-edit');

  // 入力フォーム (基本情報)
  const inputDocId = document.getElementById('input-doc-id');
  const btnRegenId = document.getElementById('btn-regen-id');
  const inputIssueDate = document.getElementById('input-issue-date');
  const inputDueDate = document.getElementById('input-due-date');
  const inputPatientId = document.getElementById('input-patient-id');
  const inputPatientName = document.getElementById('input-patient-name');
  
  // 明細テーブル
  const itemsTbody = document.getElementById('items-tbody');
  const btnAddItem = document.getElementById('btn-add-item');
  const btnClearItems = document.getElementById('btn-clear-items');

  // プリセット & 計算
  const presetsContainer = document.getElementById('presets-container');
  
  // 計算入力
  const rdoTaxInclusive = document.getElementById('tax-inclusive');
  const rdoTaxExclusive = document.getElementById('tax-exclusive');
  const selectTaxRate = document.getElementById('select-tax-rate');
  const inputCustomTaxRate = document.getElementById('input-custom-tax-rate');
  const customTaxRateSymbol = document.getElementById('custom-tax-rate-symbol');
  const inputDiscount = document.getElementById('input-discount');
  const inputAdjustment = document.getElementById('input-adjustment');
  const inputDeposit = document.getElementById('input-deposit');

  // 計算表示
  const calcItemsSum = document.getElementById('calc-items-sum');
  const calcSumType = document.getElementById('calc-sum-type');
  const calcDiscountRow = document.getElementById('calc-discount-row');
  const calcDiscountVal = document.getElementById('calc-discount-val');
  const calcSubtotalType = document.getElementById('calc-subtotal-type');
  const calcSubtotal = document.getElementById('calc-subtotal');
  const calcTaxRateLabel = document.getElementById('calc-tax-rate-label');
  const calcTaxable = document.getElementById('calc-taxable');
  const calcTaxAmount = document.getElementById('calc-tax-amount');
  const calcAdjustmentRow = document.getElementById('calc-adjustment-row');
  const calcAdjustmentVal = document.getElementById('calc-adjustment-val');
  const calcTotal = document.getElementById('calc-total');
  const calcDueAmount = document.getElementById('calc-due-amount');
  const labelDueAmount = document.getElementById('label-due-amount');

  // 特記事項・支払い方法
  const selectNoteTemplate = document.getElementById('select-note-template');
  const inputNotes = document.getElementById('input-notes');
  const inputPaymentInfo = document.getElementById('input-payment-info');

  // 医院設定
  const sectionClinicSettings = document.getElementById('section-clinic-settings');
  const toggleClinicSettings = document.getElementById('toggle-clinic-settings');
  const clinicName = document.getElementById('clinic-name');
  const clinicZip = document.getElementById('clinic-zip');
  const clinicTel = document.getElementById('clinic-tel');
  const clinicAddress = document.getElementById('clinic-address');
  const clinicInvoiceNo = document.getElementById('clinic-invoice-no');
  const bankName = document.getElementById('bank-name');
  const bankBranch = document.getElementById('bank-branch');
  const bankType = document.getElementById('bank-type');
  const bankNo = document.getElementById('bank-no');
  const bankOwner = document.getElementById('bank-owner');
  const stampText = document.getElementById('stamp-text');
  const stampFile = document.getElementById('stamp-file');
  const btnSaveClinic = document.getElementById('btn-save-clinic');
  const rdoStamps = document.querySelectorAll('input[name="stamp-type"]');
  const stampAutoSettings = document.getElementById('stamp-auto-settings');
  const stampUploadSettings = document.getElementById('stamp-upload-settings');

  // 履歴
  const historyList = document.getElementById('history-list');
  const btnSaveDocument = document.getElementById('btn-save-document');

  // 印刷プレビュー用DOM
  const printDocTitle = document.getElementById('print-doc-title');
  const printDocId = document.getElementById('print-doc-id');
  const printIssueDate = document.getElementById('print-issue-date');
  const printPatientName = document.getElementById('print-patient-name');
  const printPatientId = document.getElementById('print-patient-id');
  const printMessage = document.getElementById('print-message');
  const printClinicName = document.getElementById('print-clinic-name');
  const printClinicZip = document.getElementById('print-clinic-zip');
  const printClinicAddress = document.getElementById('print-clinic-address');
  const printClinicTel = document.getElementById('print-clinic-tel');
  const printClinicInvoiceNo = document.getElementById('print-clinic-invoice-no');
  const printClinicStamp = document.getElementById('print-clinic-stamp');
  const printTotalAmount = document.getElementById('print-total-amount');
  const printBannerTitle = document.getElementById('print-banner-title');
  const printBannerDeposit = document.getElementById('print-banner-deposit');
  const printBannerDue = document.getElementById('print-banner-due');
  const printDueDateContainer = document.getElementById('print-due-date-container');
  const printDueDate = document.getElementById('print-due-date');
  const printItemsTbody = document.getElementById('print-items-tbody');
  const printBankContainer = document.getElementById('print-bank-container');
  const printBankInfo = document.getElementById('print-bank-info');
  const printPaymentMethodsText = document.getElementById('print-payment-methods-text');
  const printNotesContainer = document.getElementById('print-notes-container');
  const printNotesText = document.getElementById('print-notes-text');
  const printThPriceLabel = document.getElementById('print-th-price-label');
  const printThAmountLabel = document.getElementById('print-th-amount-label');
  const printItemsSumType = document.getElementById('print-items-sum-type');
  const printItemsSum = document.getElementById('print-items-sum');
  const printRowDiscount = document.getElementById('print-row-discount');
  const printDiscount = document.getElementById('print-discount');
  const printSubtotalType = document.getElementById('print-subtotal-type');
  const printSubtotal = document.getElementById('print-subtotal');
  const printTaxableRate = document.getElementById('print-taxable-rate');
  const printTaxable = document.getElementById('print-taxable');
  const printTaxRatePercent = document.getElementById('print-tax-rate-percent');
  const printTaxAmount = document.getElementById('print-tax-amount');
  const printRowAdjustment = document.getElementById('print-row-adjustment');
  const printAdjustment = document.getElementById('print-adjustment');
  const printTotal = document.getElementById('print-total');
  const printDeposit = document.getElementById('print-deposit');
  const printDueLabel = document.getElementById('print-due-label');
  const printDueAmountVal = document.getElementById('print-due-amount-val');

  // --- 初期化処理 ---
  function init() {
    loadClinicInfo();
    loadHistory();
    
    // 日付の初期設定
    const today = new Date();
    state.currentDoc.issueDate = formatDateISO(today);
    
    // 支払期日はデフォルト14日後
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 14);
    state.currentDoc.dueDate = formatDateISO(dueDate);

    // ドキュメントID生成
    state.currentDoc.id = generateDocId(state.currentDoc.type, today);

    // テキストエリア等の初期値
    state.currentDoc.notes = NOTE_TEMPLATES.standard;
    state.currentDoc.paymentInfo = DEFAULT_PAYMENT_INFO;

    // UIに状態を反映
    syncStateToInputs();
    renderPresets();
    
    // 初期のダミー明細（ユーザー指定のサンプルデータ）
    state.currentDoc.patientName = '山田 太郎';
    state.currentDoc.patientId = '10001';
    state.currentDoc.taxMode = 'exclusive'; // 初期値は税抜入力
    state.currentDoc.taxRate = 0.10;
    state.currentDoc.discount = 0;
    state.currentDoc.adjustment = 0;
    state.currentDoc.deposit = 0;

    state.currentDoc.items = [
      {
        id: generateUniqueId(),
        category: '補綴',
        name: 'セラミッククラウン',
        warranty: '5年保証',
        quantity: 1,
        price: 100000,
        note: ''
      },
      {
        id: generateUniqueId(),
        category: '審美',
        name: 'ホワイトニング',
        warranty: '保証なし',
        quantity: 1,
        price: 30000,
        note: ''
      },
      {
        id: generateUniqueId(),
        category: '保存',
        name: 'メンテナンス',
        warranty: '保証なし',
        quantity: 2,
        price: 5000,
        note: ''
      }
    ];

    renderItemsTable();
    updateCalculations();
    updateAppViewMode();

    // Lucideアイコンの描画
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // --- 採番ロジック ---
  function generateDocId(type, dateObj) {
    const prefix = type === 'invoice' ? 'INV' : 'EST';
    const yyyymmdd = formatDateISO(dateObj).replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900); // 重複回避のための3桁のランダムな数字
    return `${prefix}-${yyyymmdd}-${rand}`;
  }

  // --- ヘルパー関数 ---
  function formatDateISO(date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  function formatDateJP(dateStr) {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length !== 3) return dateStr;
    return `${parts[0]}年${parts[1]}月${parts[2]}日`;
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('ja-JP').format(amount);
  }

  function generateUniqueId() {
    return 'item-' + Math.random().toString(36).substr(2, 9);
  }

  // --- 設定 & 履歴の読み込み・保存 (LocalStorage) ---
  function loadClinicInfo() {
    const saved = localStorage.getItem('ydc_clinic_info');
    if (saved) {
      try {
        state.clinicInfo = { ...state.clinicInfo, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse clinic info', e);
      }
    }
    syncClinicSettingsForm();
  }

  function saveClinicInfo() {
    localStorage.setItem('ydc_clinic_info', JSON.stringify(state.clinicInfo));
    alert('医院情報を保存しました。');
    updatePreview();
  }

  function loadHistory() {
    const saved = localStorage.getItem('ydc_doc_history');
    if (saved) {
      try {
        state.history = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse history', e);
      }
    }
    renderHistoryList();
  }

  function saveHistory() {
    localStorage.setItem('ydc_doc_history', JSON.stringify(state.history));
  }

  // --- UIとのデータ同期 ---
  function syncClinicSettingsForm() {
    clinicName.value = state.clinicInfo.name || '';
    clinicZip.value = state.clinicInfo.zip || '';
    clinicTel.value = state.clinicInfo.tel || '';
    clinicAddress.value = state.clinicInfo.address || '';
    clinicInvoiceNo.value = state.clinicInfo.invoiceNo || '';
    bankName.value = state.clinicInfo.bankName || '';
    bankBranch.value = state.clinicInfo.bankBranch || '';
    bankType.value = state.clinicInfo.bankType || '普通';
    bankNo.value = state.clinicInfo.bankNo || '';
    bankOwner.value = state.clinicInfo.bankOwner || '';
    stampText.value = state.clinicInfo.stampText || '';

    // ラジオボタンの選択状態を設定
    rdoStamps.forEach(radio => {
      if (radio.value === state.clinicInfo.stampType) {
        radio.checked = true;
      }
    });

    updateStampSettingsVisibility();
  }

  function syncStateToInputs() {
    inputDocId.value = state.currentDoc.id;
    inputIssueDate.value = state.currentDoc.issueDate;
    inputDueDate.value = state.currentDoc.dueDate;
    inputPatientId.value = state.currentDoc.patientId;
    inputPatientName.value = state.currentDoc.patientName;
    inputDeposit.value = state.currentDoc.deposit || 0;
    inputNotes.value = state.currentDoc.notes;
    inputPaymentInfo.value = state.currentDoc.paymentInfo;
    
    // 追加分の入力欄同期
    inputDiscount.value = state.currentDoc.discount || 0;
    inputAdjustment.value = state.currentDoc.adjustment || 0;

    if (state.currentDoc.taxMode === 'inclusive') {
      rdoTaxInclusive.checked = true;
    } else {
      rdoTaxExclusive.checked = true;
    }

    const currentRateStr = String(state.currentDoc.taxRate);
    if (['0.1', '0.10', '0.08', '0.05', '0'].includes(currentRateStr)) {
      selectTaxRate.value = currentRateStr === '0.1' ? '0.10' : currentRateStr;
      inputCustomTaxRate.classList.add('hidden');
      customTaxRateSymbol.classList.add('hidden');
    } else {
      selectTaxRate.value = 'custom';
      inputCustomTaxRate.value = Math.round((state.currentDoc.taxRate || 0) * 100);
      inputCustomTaxRate.classList.remove('hidden');
      customTaxRateSymbol.classList.remove('hidden');
    }

    if (state.currentDoc.type === 'invoice') {
      rdoDocTypeInvoice.checked = true;
    } else {
      rdoDocTypeEstimate.checked = true;
    }
    
    updateDocTypeLabels();
  }

  function updateStampSettingsVisibility() {
    const activeType = state.clinicInfo.stampType;
    if (activeType === 'auto') {
      stampAutoSettings.classList.remove('hidden');
      stampUploadSettings.classList.add('hidden');
    } else if (activeType === 'upload') {
      stampAutoSettings.classList.add('hidden');
      stampUploadSettings.classList.remove('hidden');
    } else {
      stampAutoSettings.classList.add('hidden');
      stampUploadSettings.classList.add('hidden');
    }
  }

  function updateDocTypeLabels() {
    const type = state.currentDoc.type;
    const labels = document.querySelectorAll('.dynamic-doc-type');
    labels.forEach(label => {
      label.textContent = type === 'invoice' ? '請求' : '見積';
    });
    
    // 計算セクションと印刷バナーのラベル調整
    if (type === 'invoice') {
      labelDueAmount.textContent = '今回請求残額 (税込):';
      printDueLabel.textContent = '今回請求残額';
      printBannerTitle.textContent = 'ご請求金額 (税込)';
      printMessage.textContent = '下記の通り、自費診療費をご請求申し上げます。';
    } else {
      labelDueAmount.textContent = '今回見積残額 (税込):';
      printDueLabel.textContent = '今回見積残額';
      printBannerTitle.textContent = 'ご見積金額 (税込)';
      printMessage.textContent = '下記の通り、自費診療費をご見積申し上げます。';
    }
  }

  // --- 計算ロジック ---
  function updateCalculations() {
    const doc = state.currentDoc;
    const taxMode = doc.taxMode || 'exclusive';
    const taxRate = doc.taxRate !== undefined ? doc.taxRate : 0.10;
    const discount = doc.discount || 0;
    const adjustment = doc.adjustment || 0;
    const deposit = doc.deposit || 0;

    let itemsSum = 0;
    doc.items.forEach(item => {
      itemsSum += item.quantity * item.price;
    });

    let subtotal = 0;
    let taxable = 0;
    let taxAmount = 0;
    let total = 0;

    if (taxMode === 'exclusive') {
      // 税抜入力
      const sumAfterDiscount = Math.max(0, itemsSum - discount);
      subtotal = sumAfterDiscount;
      taxable = sumAfterDiscount;
      taxAmount = Math.round(taxable * taxRate);
      total = subtotal + taxAmount + adjustment;
    } else {
      // 税込入力
      const sumAfterDiscount = Math.max(0, itemsSum - discount);
      total = sumAfterDiscount; // 端数調整前の税込合計額
      subtotal = Math.round(total / (1 + taxRate));
      taxable = subtotal;
      taxAmount = total - subtotal;
      total = total + adjustment;
    }

    const dueAmount = total - deposit;

    // 状態の更新
    doc.itemsSum = itemsSum;
    doc.subtotal = subtotal;
    doc.taxable = taxable;
    doc.taxAmount = taxAmount;
    doc.total = total;
    doc.dueAmount = dueAmount;

    // 編集画面ラベル・値の更新
    const labelPrice = document.getElementById('th-price-label');
    const labelAmount = document.getElementById('th-amount-label');
    if (labelPrice) labelPrice.textContent = taxMode === 'inclusive' ? '単価 (税込)' : '単価 (税抜)';
    if (labelAmount) labelAmount.textContent = taxMode === 'inclusive' ? '金額 (税込)' : '金額 (税抜)';

    calcSumType.textContent = taxMode === 'inclusive' ? '税込' : '税抜';
    calcItemsSum.textContent = '¥' + formatCurrency(itemsSum);

    if (discount > 0) {
      calcDiscountRow.style.display = 'flex';
      calcDiscountVal.textContent = '-¥' + formatCurrency(discount);
    } else {
      calcDiscountRow.style.display = 'none';
    }

    calcSubtotalType.textContent = '税抜';
    calcTaxRateLabel.textContent = `${Math.round(taxRate * 100)}%`;
    calcSubtotal.textContent = '¥' + formatCurrency(subtotal);
    calcTaxable.textContent = '¥' + formatCurrency(taxable);
    calcTaxAmount.textContent = '¥' + formatCurrency(taxAmount);

    if (adjustment !== 0) {
      calcAdjustmentRow.style.display = 'flex';
      calcAdjustmentVal.textContent = (adjustment > 0 ? '+¥' : '-¥') + formatCurrency(Math.abs(adjustment));
    } else {
      calcAdjustmentRow.style.display = 'none';
    }

    calcTotal.textContent = '¥' + formatCurrency(total);
    calcDueAmount.textContent = '¥' + formatCurrency(dueAmount);

    updatePreview();
  }

  // --- 明細テーブルの操作 ---
  function renderItemsTable() {
    itemsTbody.innerHTML = '';

    if (state.currentDoc.items.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="9" class="text-center text-muted" style="padding: 24px;">明細がありません。「行を追加」または「診療メニュー プリセット」から項目を追加してください。</td>`;
      itemsTbody.appendChild(tr);
      return;
    }

    state.currentDoc.items.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.dataset.id = item.id;
      
      const amount = item.quantity * item.price;

      tr.innerHTML = `
        <td class="text-center">
          <div class="row-actions">
            <button type="button" class="btn-row-move btn-move-up" title="上へ" ${index === 0 ? 'disabled style="opacity:0.3;cursor:default;"' : ''}><i data-lucide="chevron-up"></i></button>
            <button type="button" class="btn-row-move btn-move-down" title="下へ" ${index === state.currentDoc.items.length - 1 ? 'disabled style="opacity:0.3;cursor:default;"' : ''}><i data-lucide="chevron-down"></i></button>
          </div>
        </td>
        <td>
          <input type="text" class="input-category" value="${escapeHtml(item.category)}" placeholder="例: 補綴、インプラント">
        </td>
        <td>
          <input type="text" class="input-name" value="${escapeHtml(item.name)}" placeholder="診療項目名">
        </td>
        <td>
          <input type="text" class="input-warranty" value="${escapeHtml(item.warranty)}" placeholder="例: 5年保証">
        </td>
        <td>
          <input type="number" class="input-quantity text-right" value="${item.quantity}" min="1" step="1">
        </td>
        <td>
          <input type="number" class="input-price text-right" value="${item.price}" min="0" step="500">
        </td>
        <td class="text-right font-semibold row-amount-text">
          ¥${formatCurrency(amount)}
        </td>
        <td>
          <input type="text" class="input-note" value="${escapeHtml(item.note)}" placeholder="備考">
        </td>
        <td class="text-center">
          <button type="button" class="btn-row-delete" title="削除"><i data-lucide="trash"></i></button>
        </td>
      `;

      // イベントリスナーの追加
      const inCategory = tr.querySelector('.input-category');
      const inName = tr.querySelector('.input-name');
      const inWarranty = tr.querySelector('.input-warranty');
      const inQuantity = tr.querySelector('.input-quantity');
      const inPrice = tr.querySelector('.input-price');
      const inNote = tr.querySelector('.input-note');
      const btnUp = tr.querySelector('.btn-move-up');
      const btnDown = tr.querySelector('.btn-move-down');
      const btnDel = tr.querySelector('.btn-row-delete');

      const updateRowData = () => {
        item.category = inCategory.value;
        item.name = inName.value;
        item.warranty = inWarranty.value;
        item.quantity = parseInt(inQuantity.value) || 0;
        item.price = parseInt(inPrice.value) || 0;
        item.note = inNote.value;

        // 行の金額テキストの即時更新
        const newAmount = item.quantity * item.price;
        tr.querySelector('.row-amount-text').textContent = '¥' + formatCurrency(newAmount);
        
        updateCalculations();
      };

      inCategory.addEventListener('change', updateRowData);
      inName.addEventListener('change', updateRowData);
      inWarranty.addEventListener('change', updateRowData);
      inQuantity.addEventListener('input', updateRowData);
      inPrice.addEventListener('input', updateRowData);
      inNote.addEventListener('change', updateRowData);

      btnUp.addEventListener('click', () => moveItem(index, -1));
      btnDown.addEventListener('click', () => moveItem(index, 1));
      btnDel.addEventListener('click', () => deleteItem(item.id));

      itemsTbody.appendChild(tr);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function addItem(preset = null) {
    const newItem = {
      id: generateUniqueId(),
      category: preset ? preset.category : '',
      name: preset ? preset.name : '',
      warranty: preset ? preset.warranty : '保証なし',
      quantity: preset ? (preset.quantity || 1) : 1,
      price: preset ? preset.price : 0,
      note: preset ? preset.note : ''
    };

    state.currentDoc.items.push(newItem);
    renderItemsTable();
    updateCalculations();
  }

  function deleteItem(id) {
    state.currentDoc.items = state.currentDoc.items.filter(item => item.id !== id);
    renderItemsTable();
    updateCalculations();
  }

  function moveItem(index, direction) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= state.currentDoc.items.length) return;

    // 要素の入れ替え
    const temp = state.currentDoc.items[index];
    state.currentDoc.items[index] = state.currentDoc.items[targetIndex];
    state.currentDoc.items[targetIndex] = temp;

    renderItemsTable();
    updateCalculations();
  }

  // --- プリセットの描画 ---
  function renderPresets() {
    presetsContainer.innerHTML = '';
    PRESET_ITEMS.forEach(preset => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'preset-btn';
      btn.innerHTML = `
        <i data-lucide="plus-circle" style="width: 14px; height: 14px;"></i>
        <span>${escapeHtml(preset.name)}</span>
        <span class="price">¥${formatCurrency(preset.price)}</span>
      `;
      btn.addEventListener('click', () => {
        addItem(preset);
      });
      presetsContainer.appendChild(btn);
    });
  }

  // --- 印刷用プレビューの更新 ---
  function updatePreview() {
    const doc = state.currentDoc;
    const clinic = state.clinicInfo;

    // タイトルとメッセージ
    printDocTitle.textContent = doc.type === 'invoice' ? '請 求 書' : '見 積 書';
    
    // 基本情報
    printDocId.textContent = doc.id || '未発行';
    printIssueDate.textContent = formatDateJP(doc.issueDate);
    printPatientName.textContent = doc.patientName || '（患者氏名未入力）';
    printPatientId.textContent = doc.patientId || '（カルテNo未入力）';

    // 医院情報
    printClinicName.textContent = clinic.name;
    printClinicZip.textContent = clinic.zip;
    printClinicAddress.textContent = clinic.address;
    printClinicTel.textContent = clinic.tel;
    printClinicInvoiceNo.textContent = clinic.invoiceNo || '（未登録）';

    // 印鑑（角印）の生成
    renderClinicStamp();

    // 金額関係
    const formattedTotal = formatCurrency(doc.total || 0);
    printTotalAmount.textContent = formattedTotal;
    printBannerDeposit.textContent = formatCurrency(doc.deposit || 0);
    printBannerDue.textContent = formatCurrency(doc.dueAmount || 0);

    // 支払期日
    if (doc.type === 'invoice' && doc.dueDate) {
      printDueDateContainer.style.display = 'flex';
      printDueDate.textContent = formatDateJP(doc.dueDate);
    } else {
      printDueDateContainer.style.display = 'none';
    }

    // 明細テーブルの出力
    printItemsTbody.innerHTML = '';
    if (doc.items.length === 0) {
      printItemsTbody.innerHTML = `<tr><td colspan="7" class="text-center" style="padding: 12px; color: #888;">明細がありません。</td></tr>`;
    } else {
      doc.items.forEach((item, index) => {
        const tr = document.createElement('tr');
        const amount = item.quantity * item.price;
        tr.innerHTML = `
          <td class="text-center">${index + 1}</td>
          <td>${escapeHtml(item.category || '-')}</td>
          <td>
            <div style="font-weight: 700;">${escapeHtml(item.name || '未指定')}</div>
            ${item.note ? `<div style="font-size: 10px; color: #666; margin-top: 2px;">${escapeHtml(item.note)}</div>` : ''}
          </td>
          <td>${escapeHtml(item.warranty || '保証なし')}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">¥${formatCurrency(item.price)}</td>
          <td class="text-right">¥${formatCurrency(amount)}</td>
        `;
        printItemsTbody.appendChild(tr);
      });
    }

    // 左下エリア：振込口座・支払い方法・特記事項
    // 振込先情報
    if (clinic.bankName && clinic.bankNo) {
      printBankContainer.style.display = 'block';
      printBankInfo.innerHTML = `
        ${escapeHtml(clinic.bankName)}　${escapeHtml(clinic.bankBranch)}支店　${escapeHtml(clinic.bankType)}口座　${escapeHtml(clinic.bankNo)}<br>
        口座名義：${escapeHtml(clinic.bankOwner)}
      `;
    } else {
      printBankContainer.style.display = 'none';
    }

    // 支払い方法
    if (doc.paymentInfo) {
      printPaymentMethodsText.textContent = doc.paymentInfo;
    } else {
      printPaymentMethodsText.textContent = '窓口にてお問い合わせください。';
    }

    // 特記事項
    if (doc.notes) {
      printNotesContainer.style.display = 'block';
      printNotesText.innerHTML = escapeHtml(doc.notes).replace(/\n/g, '<br>');
    } else {
      printNotesContainer.style.display = 'none';
    }

    // 右下：計算テーブル
    if (printThPriceLabel) printThPriceLabel.textContent = doc.taxMode === 'inclusive' ? '単価 (税込)' : '単価 (税抜)';
    if (printThAmountLabel) printThAmountLabel.textContent = doc.taxMode === 'inclusive' ? '金額 (税込)' : '金額 (税抜)';

    printItemsSumType.textContent = doc.taxMode === 'inclusive' ? '税込' : '税抜';
    printItemsSum.textContent = '¥' + formatCurrency(doc.itemsSum || 0);

    const discountVal = doc.discount || 0;
    if (discountVal > 0) {
      printRowDiscount.classList.remove('hidden');
      printDiscount.textContent = '-¥' + formatCurrency(discountVal);
    } else {
      printRowDiscount.classList.add('hidden');
    }

    const taxRatePercent = Math.round((doc.taxRate || 0.10) * 100);
    printSubtotalType.textContent = '税抜';
    printSubtotal.textContent = '¥' + formatCurrency(doc.subtotal || 0);
    printTaxableRate.textContent = `${taxRatePercent}%対象額`;
    printTaxable.textContent = '¥' + formatCurrency(doc.taxable || 0);
    printTaxRatePercent.textContent = `${taxRatePercent}%`;
    printTaxAmount.textContent = '¥' + formatCurrency(doc.taxAmount || 0);

    const adjustmentVal = doc.adjustment || 0;
    if (adjustmentVal !== 0) {
      printRowAdjustment.classList.remove('hidden');
      printAdjustment.textContent = (adjustmentVal > 0 ? '+¥' : '-¥') + formatCurrency(Math.abs(adjustmentVal));
    } else {
      printRowAdjustment.classList.add('hidden');
    }

    printTotal.textContent = '¥' + formatCurrency(doc.total || 0);
    printDeposit.textContent = '¥' + formatCurrency(doc.deposit || 0);
    printDueAmountVal.textContent = '¥' + formatCurrency(doc.dueAmount || 0);
  }

  // --- 角印のレンダリング ---
  function renderClinicStamp() {
    printClinicStamp.innerHTML = '';
    const type = state.clinicInfo.stampType;

    if (type === 'auto') {
      const stampTextVal = state.clinicInfo.stampText || '医院印';
      // 文字数が少ない場合は調整する
      let formattedText = stampTextVal;
      // 4文字ごとに改行して縦書きに収まりやすくする
      if (formattedText.length > 4 && !formattedText.includes('\n')) {
        // 自動で適当に折り返すか、そのままCSSで処理
      }
      
      const stampEl = document.createElement('div');
      stampEl.className = 'auto-stamp';
      stampEl.textContent = formattedText;
      printClinicStamp.appendChild(stampEl);
    } else if (type === 'upload' && state.clinicInfo.stampImage) {
      const img = document.createElement('img');
      img.src = state.clinicInfo.stampImage;
      img.alt = '医院印';
      printClinicStamp.appendChild(img);
    }
  }

  // --- 履歴リストの描画 ---
  function renderHistoryList() {
    historyList.innerHTML = '';
    
    if (state.history.length === 0) {
      historyList.innerHTML = '<li class="history-empty">履歴がありません</li>';
      return;
    }

    // 最新の履歴が上に来るように逆順で表示
    [...state.history].reverse().forEach((doc) => {
      const li = document.createElement('li');
      li.className = 'history-item';
      
      const dateText = formatDateJP(doc.issueDate);
      const docTypeLabel = doc.type === 'invoice' ? '請求' : '見積';
      const patientLabel = doc.patientName ? `${doc.patientName} 様` : '名前なし';

      li.innerHTML = `
        <div class="history-info">
          <div class="history-title">${escapeHtml(patientLabel)}</div>
          <div class="history-meta">
            <span>[${docTypeLabel}]</span>
            <span>${doc.id}</span>
            <span>${dateText}</span>
          </div>
        </div>
        <div class="history-amount">¥${formatCurrency(doc.total || 0)}</div>
        <div class="history-actions">
          <button type="button" class="btn-clone" title="コピーして新規作成"><i data-lucide="copy"></i></button>
          <button type="button" class="btn-delete" title="削除"><i data-lucide="trash-2"></i></button>
        </div>
      `;

      // アクションの追加
      const infoEl = li.querySelector('.history-info');
      const btnClone = li.querySelector('.btn-clone');
      const btnDelete = li.querySelector('.btn-delete');

      // クリックで読み込み
      infoEl.addEventListener('click', () => {
        if (confirm('現在編集中の内容が上書きされます。この書類を読み込みますか？')) {
          state.currentDoc = JSON.parse(JSON.stringify(doc)); // ディープコピー
          syncStateToInputs();
          renderItemsTable();
          updateCalculations();
          alert('書類を読み込みました。');
        }
      });

      // コピーして新規作成（IDと日付をリセット・更新）
      btnClone.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('この書類をベースに新規書類を作成しますか？（文書番号と日付は新しく設定されます）')) {
          const cloned = JSON.parse(JSON.stringify(doc));
          const today = new Date();
          
          cloned.issueDate = formatDateISO(today);
          const dueDate = new Date();
          dueDate.setDate(today.getDate() + 14);
          cloned.dueDate = formatDateISO(dueDate);
          cloned.id = generateDocId(cloned.type, today);

          state.currentDoc = cloned;
          syncStateToInputs();
          renderItemsTable();
          updateCalculations();
          alert('コピーを作成しました。');
        }
      });

      // 削除
      btnDelete.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`「${patientLabel}」の履歴を削除しますか？`)) {
          state.history = state.history.filter(h => h.id !== doc.id);
          saveHistory();
          renderHistoryList();
        }
      });

      historyList.appendChild(li);
    });

    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  // --- イベントハンドラ登録 ---

  // 医院設定アコーディオン
  toggleClinicSettings.addEventListener('click', () => {
    sectionClinicSettings.classList.toggle('collapsed');
    const isCollapsed = sectionClinicSettings.classList.contains('collapsed');
    const icon = toggleClinicSettings.querySelector('.toggle-icon');
    if (icon) {
      icon.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
    }
  });

  // 文書タイプの切り替え
  const handleTypeChange = (typeVal) => {
    state.currentDoc.type = typeVal;
    // タイプ変更に伴って、IDを再生成（現在のIDが自動生成のものかチェックしてから行うのが親切）
    const today = new Date(state.currentDoc.issueDate || new Date());
    state.currentDoc.id = generateDocId(typeVal, today);
    inputDocId.value = state.currentDoc.id;
    
    updateDocTypeLabels();
    updateCalculations();
  };

  rdoDocTypeInvoice.addEventListener('change', () => handleTypeChange('invoice'));
  rdoDocTypeEstimate.addEventListener('change', () => handleTypeChange('estimate'));

  // 文書番号の再生成
  btnRegenId.addEventListener('click', () => {
    const today = new Date(state.currentDoc.issueDate || new Date());
    state.currentDoc.id = generateDocId(state.currentDoc.type, today);
    inputDocId.value = state.currentDoc.id;
    updateCalculations();
  });

  // 基本情報フォーム変更イベント
  inputDocId.addEventListener('change', () => {
    state.currentDoc.id = inputDocId.value;
    updatePreview();
  });
  inputIssueDate.addEventListener('change', () => {
    state.currentDoc.issueDate = inputIssueDate.value;
    updatePreview();
  });
  inputDueDate.addEventListener('change', () => {
    state.currentDoc.dueDate = inputDueDate.value;
    updatePreview();
  });
  inputPatientId.addEventListener('change', () => {
    state.currentDoc.patientId = inputPatientId.value;
    updatePreview();
  });
  inputPatientName.addEventListener('change', () => {
    state.currentDoc.patientName = inputPatientName.value;
    updatePreview();
  });

  // 税区分の切り替え
  const handleTaxModeChange = (mode) => {
    state.currentDoc.taxMode = mode;
    updateCalculations();
  };
  rdoTaxInclusive.addEventListener('change', () => handleTaxModeChange('inclusive'));
  rdoTaxExclusive.addEventListener('change', () => handleTaxModeChange('exclusive'));

  // 消費税率の変更
  selectTaxRate.addEventListener('change', () => {
    const val = selectTaxRate.value;
    if (val === 'custom') {
      inputCustomTaxRate.classList.remove('hidden');
      customTaxRateSymbol.classList.remove('hidden');
      const customRateVal = parseInt(inputCustomTaxRate.value) || 10;
      state.currentDoc.taxRate = customRateVal / 100;
    } else {
      inputCustomTaxRate.classList.add('hidden');
      customTaxRateSymbol.classList.add('hidden');
      state.currentDoc.taxRate = parseFloat(val) || 0;
    }
    updateCalculations();
  });

  inputCustomTaxRate.addEventListener('input', () => {
    const val = parseInt(inputCustomTaxRate.value) || 0;
    state.currentDoc.taxRate = val / 100;
    updateCalculations();
  });

  // 値引き入力
  inputDiscount.addEventListener('input', () => {
    state.currentDoc.discount = parseInt(inputDiscount.value) || 0;
    updateCalculations();
  });

  // 端数調整額入力
  inputAdjustment.addEventListener('input', () => {
    state.currentDoc.adjustment = parseInt(inputAdjustment.value) || 0;
    updateCalculations();
  });

  // 既収金入力
  inputDeposit.addEventListener('input', () => {
    state.currentDoc.deposit = parseInt(inputDeposit.value) || 0;
    updateCalculations();
  });

  // 特記事項 & 支払い案内
  selectNoteTemplate.addEventListener('change', () => {
    const val = selectNoteTemplate.value;
    if (val !== 'custom') {
      inputNotes.value = NOTE_TEMPLATES[val];
      state.currentDoc.notes = NOTE_TEMPLATES[val];
      updatePreview();
    }
  });

  inputNotes.addEventListener('input', () => {
    state.currentDoc.notes = inputNotes.value;
    selectNoteTemplate.value = 'custom';
    updatePreview();
  });

  inputPaymentInfo.addEventListener('input', () => {
    state.currentDoc.paymentInfo = inputPaymentInfo.value;
    updatePreview();
  });

  // 明細追加・クリアボタン
  btnAddItem.addEventListener('click', () => addItem());
  btnClearItems.addEventListener('click', () => {
    if (confirm('明細をすべて削除してもよろしいですか？')) {
      state.currentDoc.items = [];
      renderItemsTable();
      updateCalculations();
    }
  });

  // 医院設定保存
  btnSaveClinic.addEventListener('click', () => {
    state.clinicInfo.name = clinicName.value;
    state.clinicInfo.zip = clinicZip.value;
    state.clinicInfo.tel = clinicTel.value;
    state.clinicInfo.address = clinicAddress.value;
    state.clinicInfo.invoiceNo = clinicInvoiceNo.value;
    state.clinicInfo.bankName = bankName.value;
    state.clinicInfo.bankBranch = bankBranch.value;
    state.clinicInfo.bankType = bankType.value;
    state.clinicInfo.bankNo = bankNo.value;
    state.clinicInfo.bankOwner = bankOwner.value;
    state.clinicInfo.stampText = stampText.value;

    saveClinicInfo();
  });

  // 角印タイプ変更
  rdoStamps.forEach(radio => {
    radio.addEventListener('change', () => {
      state.clinicInfo.stampType = radio.value;
      updateStampSettingsVisibility();
      updatePreview();
    });
  });

  // 角印画像のアップロード処理
  stampFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        state.clinicInfo.stampImage = event.target.result;
        updatePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  // 表示モードの切り替え
  const updateAppViewMode = () => {
    const mode = document.querySelector('input[name="view-mode"]:checked').value;
    if (mode === 'edit') {
      elApp.classList.add('show-edit');
      elApp.classList.remove('show-preview');
    } else {
      elApp.classList.add('show-preview');
      elApp.classList.remove('show-edit');
      updatePreview(); // プレビューを開いたタイミングで最新化
    }
  };

  rdoModeEdit.addEventListener('change', updateAppViewMode);
  rdoModePreview.addEventListener('change', updateAppViewMode);
  btnBackEdit.addEventListener('click', () => {
    rdoModeEdit.checked = true;
    updateAppViewMode();
  });

  // 書類の保存（履歴へ追加）
  btnSaveDocument.addEventListener('click', () => {
    if (!state.currentDoc.id) {
      alert('文書番号がありません。');
      return;
    }

    // 既に同じIDがある場合は上書き、ない場合は追加
    const existingIndex = state.history.findIndex(h => h.id === state.currentDoc.id);
    const docCopy = JSON.parse(JSON.stringify(state.currentDoc)); // コピーして保存

    if (existingIndex >= 0) {
      if (confirm('既に同じ文書番号の履歴が存在します。上書き保存しますか？')) {
        state.history[existingIndex] = docCopy;
        alert('履歴を更新しました。');
      } else {
        return;
      }
    } else {
      state.history.push(docCopy);
      alert('新規履歴として保存しました。');
    }

    saveHistory();
    renderHistoryList();
  });

  // 印刷アクション
  const executePrint = () => {
    // 印刷プレビューモードにする
    const isEditMode = rdoModeEdit.checked;
    
    // 印刷時はプレビューパネルを表示状態に強制する（画面スタイルが狂うのを防ぐため）
    elApp.classList.remove('show-edit');
    elApp.classList.add('show-preview');
    updatePreview();

    // わずかにディレイを挟んで確実にDOM描画させてから印刷を呼ぶ
    setTimeout(() => {
      window.print();
      // 印刷終了後に元のモードに戻す
      if (isEditMode) {
        elApp.classList.add('show-edit');
        elApp.classList.remove('show-preview');
      }
    }, 250);
  };

  btnPrint.addEventListener('click', executePrint);
  btnPrintPreview.addEventListener('click', executePrint);

  // HTMLエスケープ処理
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- アプリケーション起動 ---
  init();
});
