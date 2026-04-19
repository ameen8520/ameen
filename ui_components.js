export const UI = {
    renderDashboard(data) {
        const top10 = [...data.students]
            .sort((a, b) => b.calculatedPoints - a.calculatedPoints)
            .slice(0, 10);

        return `
            <div class="animate-pop">
                <header class="mb-8">
                    <h1 class="text-3xl font-extrabold text-gray-800">لوحة التحكم</h1>
                    <p class="text-gray-500">مركز تحفيظ ملعب فلسطين - الإدارة</p>
                </header>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    ${this.renderStat('إجمالي الطلاب', data.students.length, 'users', 'bg-orange-500')}
                    ${this.renderStat('المتفوقين', top10.length, 'award', 'bg-amber-500')}
                    ${this.renderStat('نشاط المركز', 'نشط', 'activity', 'bg-emerald-500')}
                </div>

                <div class="card p-6 overflow-hidden relative">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-bold flex items-center gap-2">
                            <i data-lucide="trophy" class="text-gold"></i>
                            أفضل 10 طلاب هذا الأسبوع
                        </h3>
                    </div>
                    <div class="space-y-3">
                        ${top10.map((s, i) => `
                            <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-orange-100 transition-all cursor-pointer" onclick="switchView('student-detail', '${s.id}')">
                                <div class="flex items-center gap-4">
                                    <div class="w-8 h-8 flex items-center justify-center ${i < 3 ? 'gold-badge' : 'bg-white border text-gray-400'} rounded-full font-bold text-sm">
                                        ${i + 1}
                                    </div>
                                    <span class="font-bold text-gray-700">${s.fullName}</span>
                                </div>
                                <div class="text-orange-600 font-extrabold">${s.calculatedPoints} <span class="text-xs font-normal text-gray-400">نقطة</span></div>
                            </div>
                        `).join('') || '<p class="text-center py-12 text-gray-400">لا يوجد بيانات للتقييم حالياً</p>'}
                    </div>
                </div>
            </div>
        `;
    },

    renderStat(title, value, icon, bg) {
        return `
            <div class="card p-6 flex items-center gap-5 border-none shadow-sm">
                <div class="${bg} p-4 rounded-2xl text-white shadow-lg">
                    <i data-lucide="${icon}"></i>
                </div>
                <div>
                    <p class="text-sm font-bold text-gray-400">${title}</p>
                    <h3 class="text-2xl font-black text-gray-800">${value}</h3>
                </div>
            </div>
        `;
    },

    renderStudentList(students) {
        return `
            <div class="animate-pop">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 class="text-3xl font-bold text-gray-800">الطلاب</h1>
                        <p class="text-gray-500">إدارة الملفات الشخصية والبيانات</p>
                    </div>
                    <button onclick="showAddStudentModal()" class="w-full sm:w-auto bg-primary text-white px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold shadow-lg">
                        <i data-lucide="user-plus"></i> إضافة طالب جديد
                    </button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${students.map(s => `
                        <div class="card p-6 hover:shadow-md transition-all cursor-pointer" onclick="switchView('student-detail', '${s.id}')">
                            <div class="flex justify-between items-start mb-4">
                                <div class="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                                    ${s.fullName.charAt(0)}
                                </div>
                                <span class="bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-full">${s.nid}</span>
                            </div>
                            <h3 class="font-bold text-lg mb-1 truncate">${s.fullName}</h3>
                            <p class="text-sm text-gray-400 mb-4 flex items-center gap-1"><i data-lucide="phone" class="w-3"></i> ${s.guardianPhone}</p>
                            <div class="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">${s.progress}</span>
                                <i data-lucide="chevron-left" class="w-4 h-4 text-gray-300"></i>
                            </div>
                        </div>
                    `).join('') || '<div class="col-span-full py-20 text-center text-gray-400">قائمة الطلاب فارغة</div>'}
                </div>
            </div>
        `;
    },

    renderStudentDetail(student) {
        if (!student) return '<p>الطالب غير موجود</p>';
        const lastMemo = student.history?.[0] || { surah: '---', ayahEnd: '---' };

        return `
            <div class="animate-pop pb-10">
                <button onclick="switchView('students')" class="mb-6 flex items-center gap-2 text-gray-500 hover:text-primary font-bold">
                    <i data-lucide="arrow-right" class="w-4"></i> العودة للقائمة
                </button>

                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div class="lg:col-span-1 space-y-6">
                        <div class="card p-6 text-center">
                            <div class="w-24 h-24 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-4 border-2 border-orange-100 p-1">
                                <img src="https://api.dicebear.com/7.x/initials/svg?seed=${student.fullName}&backgroundColor=FF8C00" class="rounded-2xl">
                            </div>
                            <h2 class="text-2xl font-black text-gray-800">${student.fullName}</h2>
                            <p class="text-gray-400 text-sm mb-4">${student.nid}</p>
                            <div class="flex justify-center gap-2">
                                <span class="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">النقاط: ${student.calculatedPoints}</span>
                                <span class="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold">${student.progress}</span>
                            </div>
                        </div>

                        <div class="card p-6">
                            <h3 class="font-bold mb-4 flex items-center gap-2"><i data-lucide="info" class="w-4"></i> معلومات التواصل</h3>
                            <div class="space-y-3 text-sm">
                                <div class="flex justify-between"><span class="text-gray-400">تاريخ الميلاد:</span> <span class="font-bold">${student.dob}</span></div>
                                <div class="flex justify-between"><span class="text-gray-400">رقم ولي الأمر:</span> <span class="font-bold">${student.guardianPhone}</span></div>
                            </div>
                        </div>
                    </div>

                    <div class="lg:col-span-2 space-y-6">
                        <div class="card p-6 border-2 border-primary/20">
                            <h3 class="text-xl font-black text-primary mb-4 flex items-center gap-2">
                                <i data-lucide="book-open"></i> تسجيل حفظ جديد
                            </h3>
                            <form onsubmit="saveMemorization(event, '${student.id}')" class="space-y-4">
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="space-y-1">
                                        <label class="text-xs font-bold text-gray-400">آخر سورة وصل إليها</label>
                                        <div class="p-3 bg-gray-50 rounded-xl font-bold text-gray-500">${lastMemo.surah}</div>
                                    </div>
                                    <div class="space-y-1">
                                        <label class="text-xs font-bold text-gray-400">آخر آية</label>
                                        <div class="p-3 bg-gray-50 rounded-xl font-bold text-gray-500">${lastMemo.ayahEnd}</div>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input name="surah" placeholder="اسم السورة الجديدة" required class="p-4 rounded-xl border bg-white outline-none focus:border-primary">
                                    <input name="ayahStart" placeholder="من آية" required class="p-4 rounded-xl border bg-white outline-none focus:border-primary">
                                    <input name="ayahEnd" placeholder="إلى آية" required class="p-4 rounded-xl border bg-white outline-none focus:border-primary">
                                </div>
                                <textarea name="notes" placeholder="ملاحظات المحفظ..." class="w-full p-4 rounded-xl border bg-white outline-none focus:border-primary h-20"></textarea>
                                <button type="submit" class="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-lg">حفظ الإنجاز</button>
                            </form>
                        </div>

                        <div class="card p-6">
                            <h3 class="font-bold mb-6 flex items-center gap-2"><i data-lucide="history" class="w-5 text-primary"></i> سجل التطور</h3>
                            <div class="relative space-y-6 before:absolute before:right-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-orange-100">
                                ${(student.history || []).map(h => `
                                    <div class="relative pr-10">
                                        <div class="absolute right-0 top-1 w-8 h-8 bg-white border-2 border-primary rounded-full flex items-center justify-center z-10">
                                            <i data-lucide="check" class="w-4 h-4 text-primary"></i>
                                        </div>
                                        <div class="bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-orange-100 transition-all">
                                            <div class="flex justify-between items-start mb-2">
                                                <h4 class="font-black text-gray-800">${h.surah} (${h.ayahStart}-${h.ayahEnd})</h4>
                                                <span class="text-[10px] text-gray-400 font-bold">${new Date(h.timestamp).toLocaleDateString('ar-SA')}</span>
                                            </div>
                                            <p class="text-sm text-gray-500 leading-relaxed">${h.notes || 'لا توجد ملاحظات'}</p>
                                        </div>
                                    </div>
                                `).join('') || '<p class="text-center py-10 text-gray-400">لا يوجد سجل للحفظ بعد</p>'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    renderStudentForm() {
        return `
            <form onsubmit="saveStudent(event)" class="p-8">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold">إضافة طالب</h2>
                    <button type="button" onclick="closeModal()" class="text-gray-400"><i data-lucide="x"></i></button>
                </div>
                <div class="space-y-4">
                    <div class="space-y-1">
                        <label class="text-sm font-bold text-gray-500">الاسم الرباعي</label>
                        <input name="fullName" required class="w-full p-4 rounded-xl border-2 border-gray-50 focus:border-primary outline-none" placeholder="الاسم الرباعي الكامل">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <label class="text-sm font-bold text-gray-500">تاريخ الميلاد</label>
                            <input name="dob" type="date" required class="w-full p-4 rounded-xl border-2 border-gray-50 focus:border-primary outline-none">
                        </div>
                        <div class="space-y-1">
                            <label class="text-sm font-bold text-gray-500">الرقم الوطني</label>
                            <input name="nid" required pattern="[0-9]{9}" class="w-full p-4 rounded-xl border-2 border-gray-50 focus:border-primary outline-none" placeholder="9 أرقام">
                        </div>
                    </div>
                    <div class="space-y-1">
                        <label class="text-sm font-bold text-gray-500">رقم جوال ولي الأمر</label>
                        <input name="guardianPhone" required class="w-full p-4 rounded-xl border-2 border-gray-50 focus:border-primary outline-none" placeholder="059xxxxxxx">
                    </div>
                </div>
                <button type="submit" class="w-full mt-8 bg-primary text-white py-4 rounded-2xl font-bold shadow-lg">إضافة الطالب</button>
            </form>
        `;
    },

    renderAttendance(students, attendance) {
        const today = new Date().toISOString().split('T')[0];
        return `
            <div class="animate-pop">
                <header class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-800">سجل الحضور</h1>
                    <p class="text-gray-500">تتبع الحضور الأسبوعي (سبت، اثنين، أربعاء)</p>
                </header>
                <div class="card p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="p-3 bg-orange-100 rounded-xl text-primary"><i data-lucide="calendar"></i></div>
                        <div>
                            <p class="text-xs text-gray-400 font-bold">تاريخ اليوم</p>
                            <p class="font-bold">${new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                </div>
                <div class="space-y-3">
                    ${students.map(s => {
                        const status = attendance[today]?.[s.id] || 'absent';
                        return `
                        <div class="card p-4 flex items-center justify-between transition-colors ${status === 'present' ? 'bg-emerald-50/50 border-emerald-100' : ''}">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full bg-white border flex items-center justify-center font-bold">
                                    ${s.fullName.charAt(0)}
                                </div>
                                <span class="font-bold text-gray-700">${s.fullName}</span>
                            </div>
                            <button onclick="toggleAttendance('${s.id}', '${today}')" class="px-6 py-2 rounded-xl font-bold transition-all ${status === 'present' ? 'bg-emerald-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}">
                                ${status === 'present' ? 'حاضر' : 'غائب'}
                            </button>
                        </div>
                        `;
                    }).join('') || '<p class="text-center py-10">لا يوجد طلاب مسجلين</p>'}
                </div>
            </div>
        `;
    },

    renderSync(data) {
        return `
            <div class="animate-pop">
                <header class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-800">مزامنة البيانات</h1>
                    <p class="text-gray-500">مشاركة السجلات بين أجهزة المحفظين</p>
                </header>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div class="card p-8 text-center flex flex-col items-center">
                        <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm"><i data-lucide="qr-code" class="w-8 h-8"></i></div>
                        <h3 class="text-xl font-bold mb-2">تصدير (QR Code)</h3>
                        <p class="text-sm text-gray-400 mb-6">أظهر الكود لزميلك لمسحه</p>
                        <button onclick="generateSyncQR()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg">توليد الكود</button>
                        <div id="sync-qr-container" class="mt-6"></div>
                    </div>
                    <div class="card p-8 text-center flex flex-col items-center">
                        <div class="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm"><i data-lucide="scan" class="w-8 h-8"></i></div>
                        <h3 class="text-xl font-bold mb-2">استيراد (Scanner)</h3>
                        <p class="text-sm text-gray-400 mb-6">امسح كود المزامنة من جهاز زميلك</p>
                        <button onclick="startQRScanner()" class="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg">فتح الكاميرا</button>
                        <div id="reader" class="mt-6 w-full hidden border rounded-2xl overflow-hidden"></div>
                    </div>
                </div>
                <div class="card p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border-dashed">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-orange-100 text-primary rounded-2xl flex items-center justify-center"><i data-lucide="file-json"></i></div>
                        <div>
                            <h4 class="font-bold">تصدير ملف المزامنة</h4>
                            <p class="text-sm text-gray-400">حفظ نسخة كاملة للبيانات</p>
                        </div>
                    </div>
                    <div class="flex gap-2 w-full sm:w-auto">
                        <button onclick="exportJSON()" class="flex-1 bg-white border-2 border-gray-100 p-4 rounded-2xl font-bold hover:bg-gray-50">تصدير</button>
                        <input type="file" id="import-input" class="hidden" onchange="handleImport(event)">
                        <button onclick="document.getElementById('import-input').click()" class="flex-1 bg-primary text-white p-4 rounded-2xl font-bold">استيراد</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderParentPortal() {
        return `
            <div class="animate-pop min-h-[70vh] flex flex-col items-center justify-center">
                <div class="w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center text-primary mb-6 shadow-xl">
                    <i data-lucide="shield-check" class="w-12 h-12"></i>
                </div>
                <h1 class="text-3xl font-black text-gray-800 mb-2">بوابة الأهالي</h1>
                <p class="text-gray-500 mb-8 text-center">أدخل الرقم الوطني للطالب لمتابعة آخر تحديثات الحفظ</p>
                
                <div class="w-full max-w-md">
                    <div class="card p-4 flex gap-2 border-2 border-orange-50 mb-8">
                        <input id="parent-nid" type="text" pattern="[0-9]*" inputmode="numeric" placeholder="9 أرقام الهوية..." 
                            class="flex-1 p-4 bg-transparent outline-none font-bold text-xl tracking-widest text-center">
                        <button onclick="searchParent()" class="bg-primary text-white px-6 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all">
                            <i data-lucide="search"></i>
                        </button>
                    </div>
                    <div id="parent-result-area"></div>
                </div>
            </div>
        `;
    },

    renderParentResult(student) {
        const lastMemo = student.history?.[0] || { surah: '---', ayahEnd: '---', notes: 'لم يتم البدء بعد' };
        return `
            <div class="card p-8 space-y-8 bg-white shadow-2xl animate-pop border-primary/10">
                <div class="flex items-center gap-5 border-b pb-6">
                    <div class="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-2xl shadow-lg">
                        ${student.fullName.charAt(0)}
                    </div>
                    <div>
                        <h2 class="text-2xl font-black text-gray-800 leading-tight">${student.fullName}</h2>
                        <p class="text-gray-400 text-sm flex items-center gap-1 font-bold mt-1">
                            <i data-lucide="user" class="w-4"></i> الرقم الوطني: ${student.nid}
                        </p>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div class="p-4 bg-orange-50 rounded-2xl">
                        <p class="text-[10px] font-bold text-orange-400 mb-1 uppercase tracking-wider">آخر سورة مسجلة</p>
                        <p class="font-black text-lg text-primary">${lastMemo.surah}</p>
                    </div>
                    <div class="p-4 bg-amber-50 rounded-2xl">
                        <p class="text-[10px] font-bold text-amber-500 mb-1 uppercase tracking-wider">إجمالي النقاط</p>
                        <p class="font-black text-lg text-amber-600">${student.calculatedPoints}</p>
                    </div>
                </div>

                <div class="space-y-3">
                    <h4 class="font-bold text-gray-800 flex items-center gap-2">
                        <i data-lucide="book-open" class="w-5 text-primary"></i> آخر تحديث للحفظ
                    </h4>
                    <div class="p-5 bg-gray-50 rounded-2xl text-gray-600 leading-relaxed border border-gray-100">
                        <p class="font-bold text-gray-800 mb-1">المدى: ${lastMemo.ayahStart || '0'} - ${lastMemo.ayahEnd || '0'}</p>
                        <p class="text-sm">${lastMemo.notes || 'لا توجد ملاحظات إضافية'}</p>
                    </div>
                </div>

                <div class="pt-2">
                   <p class="text-xs text-center text-gray-400 font-bold mb-4">يتم تحديث البيانات أسبوعياً من قبل المحفظ</p>
                </div>
            </div>
        `;
    }
};
