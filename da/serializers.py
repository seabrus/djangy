from rest_framework import serializers

from . models import Company, OpeningHours


class OpeningHoursSerializer(serializers.ModelSerializer):
    db_id = serializers.IntegerField( source='id' )

    class Meta:
        model = OpeningHours
        fields = ('id', 'day_name', 'from_time', 'until_time', 'db_id', ) 


#   ---   It looks like ListSerializer is only for bulk operations but not for the nested objects
#class HoursListSerializer(serializers.ListSerializer):   
    #pass


class CompanySerializer(serializers.ModelSerializer):
    hours = OpeningHoursSerializer( many=True )     # similar to: openinghours_set = OpeningHoursSerializer(many=True), see models.py
    logo_url = serializers.SerializerMethodField(read_only=True)    # --- see  "get_logo_url(self, obj)"  function below
    #logo_url = serializers.ReadOnlyField( source='logo_img.url' )   # -- Causes an error if the file is empty       # CharField(read_only=True)

    class Meta:
        model = Company
        fields = ( 'id', 'company_name', 'founded_at', 'email', 'payment_method', 'subscription_plan', 
                      'logo_img', 'logo_url', 
                      'hours', 
                    )
        #list_serializer_class = HoursListSerializer

    def get_logo_url(self, obj):
        if bool( obj.logo_img ):
            return obj.logo_img.url
        return ''

    # This is used for creating a new model instance in the  serializer.save(...)  call
    def create(self, validated_data):
        hours_data = validated_data.pop('hours')
        hours_len = len(hours_data)
        company = Company.objects.create(**validated_data)
        if hours_len != 0:
            for i in range( hours_len ):
                hours_data[i].pop('id')
                #hours_data[i].pop('db_id')   # this should be present as part of OpeningHoursSerializer's NON read-only fields
                OpeningHours.objects.create(company=company, **hours_data[i])
        return company

    # This is used for updating an existing model instance in the  serializer.save(...)  call
    def update(self, instance, validated_data):
        hours = instance.hours.all()   # Can be empty []
        if hours.count() > 0:
            hours.delete()

        hours_data = validated_data.pop('hours')
        hours_len = len(hours_data)
        if hours_len != 0:
            for i in range( hours_len ):
                hours_data[i].pop('id')
                OpeningHours.objects.create(company=instance, **hours_data[i])

        instance.company_name = validated_data.get('company_name', instance.company_name)
        instance.founded_at = validated_data.get('founded_at', instance.founded_at)
        instance.email = validated_data.get('email', instance.email)
        instance.payment_method = validated_data.get('payment_method', instance.payment_method)
        instance.subscription_plan = validated_data.get('subscription_plan', instance.subscription_plan)

        if validated_data.has_key('logo_img'):
            if bool(instance.logo_img):     # Delete the previous version of logo, if exists
                instance.logo_img.delete(save=False)
            instance.logo_img = validated_data.get('logo_img')

        instance.save()
        return instance



# =========================================================================================
#   INFO and SNIPPETS for nested objects processing
# =========================================================================================
""" 
 http://www.django-rest-framework.org/api-guide/serializers/#dealing-with-nested-objects

class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = User
        fields = ('username', 'email', 'profile')

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')
        user = User.objects.create(**validated_data)
        Profile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile')
        # Unless the application properly enforces that this field is
        # always set, the follow could raise a `DoesNotExist`, which
        # would need to be handled.
        profile = instance.profile

        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile.is_premium_member = profile_data.get(
            'is_premium_member',
            profile.is_premium_member
        )
        profile.has_support_contract = profile_data.get(
            'has_support_contract',
            profile.has_support_contract
         )
        profile.save()

        return instance

http://www.django-rest-framework.org/api-guide/serializers/#dealing-with-nested-objects
Deserializing multiple objects

The default behavior for deserializing multiple objects is to support multiple object creation, but not support multiple object updates. For more information on how to support or customize either of these cases, see the ListSerializer documentation below.
 - http://www.django-rest-framework.org/api-guide/serializers/#listserializer

Also 
     -- Writable nested serializers, http://www.django-rest-framework.org/api-guide/relations/#writable-nested-serializers


    def update(self, instance, validated_data):
        # Maps for id->instance and id->data item.
        book_mapping = {book.id: book for book in instance}
        data_mapping = {item['id']: item for item in validated_data}

        # Perform creations and updates.
        ret = []
        for book_id, data in data_mapping.items():
            book = book_mapping.get(book_id, None):
            if book is None:
                ret.append(self.child.create(data))
            else:
                ret.append(self.child.update(book, data))

        # Perform deletions.
        for book_id, book in book_mapping.items():
            if book_id not in data_mapping:
                book.delete()

        return ret
"""
