function randomCalcName() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    var string_length = 10;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}

$(document).ready(function() {
    // Calc name
    $('#classic .calc-name').val(randomCalcName());

    // Create calc
    $('#create-calc').on('submit', function() {
        var calc_name = ($('#classic-calc-name').val()=='') ? randomCalcName() : $('#classic-calc-name').val();
        var calc_url = 'https://framacalc.org/'+calc_name;
        
        $('#calc-url').attr('href', calc_url);
        document.getElementById('calc-url').click();

        return false;
    });
});
