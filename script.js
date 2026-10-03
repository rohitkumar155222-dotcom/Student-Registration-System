document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const dobInput = document.getElementById('dob');
    const ageInput = document.getElementById('age');
    const alertBox = document.getElementById('alertBox');
    const storedDetails = document.getElementById('storedDetails');

    loadStoredData();

    dobInput.addEventListener('change', () => {
        const dob = new Date(dobInput.value);
        if (!isNaN(dob.getTime())) {
            const age = calculateAge(dob);
            ageInput.value = `${age} years old`;
        } else {
            ageInput.value = '';
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();

        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const dobVal = dobInput.value;
        const course = document.getElementById('course').value;
        const phone = document.getElementById('phone').value.trim();

        let isValid = true;

        if (!/^[a-zA-Z\s]+$/.test(fullName)) {
            document.getElementById('fullName').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('fullName').classList.remove('is-invalid');
            document.getElementById('fullName').classList.add('is-valid');
        }

        const dob = new Date(dobVal);
        const age = calculateAge(dob);
        if (isNaN(age) || age < 17) {
            dobInput.classList.add('is-invalid');
            isValid = false;
        } else {
            dobInput.classList.remove('is-invalid');
            dobInput.classList.add('is-valid');
        }

        if (!/^\d{10}$/.test(phone)) {
            document.getElementById('phone').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('phone').classList.remove('is-invalid');
            document.getElementById('phone').classList.add('is-valid');
        }

        if (!course) {
            document.getElementById('course').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('course').classList.remove('is-invalid');
            document.getElementById('course').classList.add('is-valid');
        }

        if (!email || !form.checkValidity()) {
            document.getElementById('email').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('email').classList.remove('is-invalid');
            document.getElementById('email').classList.add('is-valid');
        }

        if (isValid) {
            const studentData = {
                fullName,
                email,
                age,
                course,
                phone,
                registeredAt: new Date().toLocaleString()
            };

            localStorage.setItem('registeredStudent', JSON.stringify(studentData));
            setCookie('studentName', fullName, 7);

            showAlert('Registration successful! Data saved to local storage and cookies.', 'success');
            loadStoredData();
            form.reset();
            form.classList.remove('was-validated');
            clearValidations();
        } else {
            showAlert('Please fix the errors in the form before submitting.', 'danger');
        }
    });

    function calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    function showAlert(message, type) {
        alertBox.className = `alert alert-${type}`;
        alertBox.textContent = message;
        alertBox.classList.remove('d-none');
    }

    function clearValidations() {
        const inputs = form.querySelectorAll('.form-control, .form-select');
        inputs.forEach(input => {
            input.classList.remove('is-valid', 'is-invalid');
        });
    }

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function loadStoredData() {
        const data = localStorage.getItem('registeredStudent');
        if (data) {
            const student = JSON.parse(data);
            storedDetails.innerHTML = `
                <ul class="list-group">
                    <li class="list-group-item"><strong>Name:</strong> ${student.fullName}</li>
                    <li class="list-group-item"><strong>Email:</strong> ${student.email}</li>
                    <li class="list-group-item"><strong>Age:</strong> ${student.age} years</li>
                    <li class="list-group-item"><strong>Course:</strong> ${student.course}</li>
                    <li class="list-group-item"><strong>Phone:</strong> ${student.phone}</li>
                    <li class="list-group-item"><strong>Registered On:</strong> ${student.registeredAt}</li>
                </ul>
            `;
        }
    }
});
      
