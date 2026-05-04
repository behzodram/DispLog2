function insertTest() {

        const roles = ["DISPATCH", "DRIVER", "SHIPPER"];
        const regions = ["FAR", "AND", "BUX", "JIZ", "XOR", "QORA", "QASH", "NAV", "NAM", "SUR", "SAM", "SIRD", "TOSH"];
        const vehicles = ["FURA", "ISUZU", "CHAKMAN", "KAMAZ"];

        function rand(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function randomPhone() {
            let num = "998";
            for (let i = 0; i < 9; i++) {
                num += Math.floor(Math.random() * 10);
            }
            return num;
        }

        var testPhone = randomPhone();
        var testRole = rand(roles);

        var testFrom = rand(regions);
        var testTo = rand(regions);

        while (testTo === testFrom) {
            testTo = rand(regions);
        }

        var testVehicle = rand(vehicles);

        INSERT_USER_PRFTV(testPhone, testRole, testFrom, testTo, testVehicle);
    }
function CallTest(time) {
    // 🔥 Har 50ms da ishlaydi
    setInterval(insertTest, time);
}