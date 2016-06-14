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

jQuery(document).ready(function() {

    /** Home page **/
    // Calc name
    jQuery('#classic .calc-name').val(randomCalcName());

    // Create calc
    jQuery('#create-calc').on('submit', function() {
        var calc_name = (jQuery('#classic-calc-name').val()=='') ? randomCalcName() : jQuery('#classic-calc-name').val();
        if (jQuery('#use_tabs:checked').length == 1) {
            calc_name = '='+calc_name;
        }
        var calc_url = 'https://framacalc.org/'+calc_name;

        jQuery('#calc-url').attr('href', calc_url);
        document.getElementById('calc-url').click();

        return false;
    });

    jQuery('#FAQ .modal-body').load("https://contact.framasoft.org/foire-aux-questions/ #framacalc .list-group-item");
    jQuery('#tuto-faq a[href*="foire-aux-questions"]').click(function(){jQuery('#FAQ').modal('show');return false;})

    /** Ethercalc **/
    // Tab Ethercalc Revisions Tool (ERT : https://framagit.org/framasoft/ert )
    function calc_exists() {
        jQuery.ajax('/ert/rev_exists'+window.location.pathname, {
            method: 'GET',
            dataType: 'json',
            success: function(data, textStatus, jqXHR) {
                if (data.exists) {
                    setTimeout(function() {
                        if ($('#SocialCalc-graphtab')) { $('#SocialCalc-graphtab').parent().append(
                            '<td id="#SocialCalc-erttab" style="'+$('#SocialCalc-graphtab').attr('style')+'" onclick="window.open(\'/ert'+window.location.pathname+'\');">Anciennes révisions</td>'
                        );}
                    }, 5000);
                } else {
                    setTimeout(function() {
                        calc_exists()
                    }, 60000);
                }
            }
        });
    }
    calc_exists();
});



