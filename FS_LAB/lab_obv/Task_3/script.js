class Student {
    constructor(name, roll, department, cgpa) {
        this.name = name;
        this.roll = roll;
        this.department = department;
        this.cgpa = cgpa;
    }

    getDetails() {
        return {
            Name: this.name,
            'Roll No': this.roll,
            Department: this.department,
            CGPA: this.cgpa,
        };
    }
}
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('create-btn');
    const container = document.getElementById('profile-container');
    function createProfileCard(student) {
        container.innerHTML = '';
        const card = document.createElement('div');
        card.className = 'profile-card';

        const title = document.createElement('h2');
        title.textContent = 'Student Profile';
        card.appendChild(title);

        const dl = document.createElement('dl');
        const details = student.getDetails();
        for (const key in details) {
            const dt = document.createElement('dt');
            dt.textContent = key + ':';
            const dd = document.createElement('dd');
            dd.textContent = details[key];
            dl.appendChild(dt);
            dl.appendChild(dd);
        }

        card.appendChild(dl);
        container.appendChild(card);
    }
    btn.addEventListener('click', () => {
        const name = document.getElementById('name').value.trim();
        const roll = document.getElementById('roll').value.trim();
        const dept = document.getElementById('dept').value.trim();
        const cgpaVal = document.getElementById('cgpa').value.trim();

        if (!name || !roll || !dept || !cgpaVal) {
            alert('Please fill all fields.');
            return;
        }
        const cgpa = parseFloat(cgpaVal);
        const student = new Student(name, roll, dept, isNaN(cgpa) ? cgpaVal : cgpa);
        createProfileCard(student);
    });
});