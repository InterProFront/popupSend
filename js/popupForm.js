$(document).ready(function(){
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });



    // Проверка почты на соответствие маске *@*.*
    function isEmail( mail ){
        regex = /[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}/igm;
        return !regex.test(mail);
    }


    // Очистка формы
    function clearFields(id){
        $('#'+id+' .popup-input').each(function(){
            $(this).val('');
        });
    }

    // Проверка полей формы на отсутствие пустых полей
    function  fieldsCheck( selector ){
        var error = false;
        $(selector).each(function () {
           $this = $(this);


           if ( !( $this.val() != '') ){
               error = true;
               $this.addClass('error');
           }
           if ( $this.data('field-name') == 'email' || $this.data('field-name') == 'mail' ){
               if (isEmail($this.val())){
                   $this.addClass('error');
                   error = true;
               }
           }
        });
        return error;
    }

    // Сбор данных с формы и формирование объекта
    function addFields( selector, object ){

        $(selector).each(function () {
            var $this = $(this);

            var field_type = $this.data('field-type');
            var field_name = $this.data('field-name');

            if (field_type == 'bool') {
                object['bools'][field_name] = $this.is(':checked');

            } else if (field_type == 'text') {
                object['textfields'][field_name] = $this.val();

            } else if (field_type == 'string') {
                object['stringfields'][field_name] = $this.val();

            } else if (field_type == 'numb') {
                object['numbs'][field_name] = $this.val();
            }
        });
    }

    $('.send-form').on('click',function() {
        unical = $(this).parent('.white-popup').attr('id');
        $this = $(this);
        var dataobj = {};
        dataobj['block'] = 'fidback';
        dataobj['type_name'] = unical;
        dataobj['stringfields'] = {};
        dataobj['textfields'] = {};
        dataobj['bools'] = {};
        dataobj['numbs'] = {};
        dataobj['images'] = {};


        var selector = '#'+unical+' .popup_field';
        var validForm  = fieldsCheck( selector );

        if (!validForm){
            addFields(selector, dataobj);

            var deferred = $.ajax(
                {
                    type: 'POST',
                    url: '/fidback/sendform',
                    dataType: 'json',
                    data: dataobj
                }
            );

            $this.addClass('load');


            deferred.success(function(data){


                $.magnificPopup.open({
                    items: {
                        src: '#thanks'
                    },
                    type: 'inline'
                });
                clearFields(unical);
                $this.removeClass('load');

            });
            deferred.error(function(data){
                console.log(data);
                $this.removeClass('load');
            });


        }




    });

});