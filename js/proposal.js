/*
  Jquery Validation using jqBootstrapValidation
  */
$(function() {

    $("input,textarea").jqBootstrapValidation({
        preventSubmit: true,
        submitError: function($form, event, errors) {
            // something to have when submit produces an error ?
            // Not decided if I need it yet
        },
        submitSuccess: function($form, event) {
            event.preventDefault(); // prevent default submit behaviour
            // get values from FORM
            var name = $("input#name").val();
            var email = $("input#email").val();
            var telephone = $("input#telephone").val();
            var type = $("input#type").val();
            var budget = $("input#budget").val();
            var delivery = $("input#delivery").val();
            var outline = $("textarea#outline").val();
            var firstName = name; // For Success/Failure Message
            // Check for white space in name for Success/Fail message
            if (firstName.indexOf(' ') >= 0) {
                firstName = name.split(' ').slice(0, -1).join(' ');
            }
            $.ajax({
                url: "includes/proposal/proposal.php",
                type: "POST",
                data: {
                    name: name,
                    email: email,
                    telephone: telephone,
                    type: type,
                    budget: budget,
                    delivery: delivery,
                    outline: outline
                },
                cache: false,
                success: function() {
                    // Success message
                    $('#success').html("<div class='alert alert-success'>");
                    $('#success > .alert-success').html("")
                        .append("</button>");
                    $('#success > .alert-success')
                        .append("Success! Your message has been sent.");
                    $('#success > .alert-success')
                        .append('</div>');

                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
                error: function() {
                    // Fail message
                    $('#success').html("<div class='alert alert-danger'>");
                    $('#success > .alert-danger').html("")
                        .append("</button>");
                    $('#success > .alert-danger').append("WHOA! Sorry " + firstName + ", it seems my email system is having a moment... Please email me directly to <a href='mailto:me@example.com'>me@example.com</a>.");
                    $('#success > .alert-danger').append('</div>');
                    //clear all fields
                    $('#contactForm').trigger("reset");
                },
            })
        },
        filter: function() {
            return $(this).is(":visible");
        },
    });

    $("a[data-toggle=\"tab\"]").click(function(e) {
        e.preventDefault();
        $(this).tab("show");
    });
});


/*When clicking on Full hide fail/success boxes */
$('#name').focus(function() {
    $('#success').html('');
});