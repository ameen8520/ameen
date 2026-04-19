export const Storage = {
    init() {
        if (!localStorage.getItem('tahfiz_data')) {
            const initialData = {
                students: [],
                attendance: {},
                settings: { centerName: 'مركز تحفيظ ملعب فلسطين' }
            };
            localStorage.setItem('tahfiz_data', JSON.stringify(initialData));
        }
    },

    getData() {
        const data = JSON.parse(localStorage.getItem('tahfiz_data')) || { students: [], attendance: {} };

        data.students.forEach(s => {
            let attendScore = 0;
            const dates = Object.keys(data.attendance);
            dates.forEach(d => {
                if (data.attendance[d][s.id] === 'present') attendScore += 10;
            });
            
            const memoPoints = (s.history?.length || 0) * 5;
            s.calculatedPoints = (parseInt(s.points) || 0) + attendScore + memoPoints;
        });
        return data;
    },

    saveData(data) {
        localStorage.setItem('tahfiz_data', JSON.stringify(data));
    },

    addStudent(student) {
        const data = this.getData();
        student.id = Date.now().toString();
        student.points = parseInt(student.points) || 0;
        student.progress = 'مبتدئ';
        student.history = [];
        data.students.push(student);
        this.saveData(data);
    },

    addMemorization(studentId, entry) {
        const data = this.getData();
        const student = data.students.find(s => s.id === studentId);
        if (student) {
            if (!student.history) student.history = [];
            student.history.unshift({
                ...entry,
                timestamp: new Date().toISOString()
            });
            student.progress = `${entry.surah} : ${entry.ayahEnd}`;
            this.saveData(data);
        }
    },

    markAttendance(date, studentId, status) {
        const data = this.getData();
        if (!data.attendance[date]) data.attendance[date] = {};
        data.attendance[date][studentId] = status;
        this.saveData(data);
    },

    exportData() {
        const data = localStorage.getItem('tahfiz_data');
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tahfiz_backup_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    },

    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    if (data.students) {
                        localStorage.setItem('tahfiz_data', JSON.stringify(data));
                        resolve(true);
                    } else reject('تنسيق غير مدعوم');
                } catch (err) { reject(err); }
            };
            reader.readAsText(file);
        });
    }
};
