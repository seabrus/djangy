from rest_framework import serializers

from . models import Company, OpeningHours


class OpeningHoursSerializer(serializers.ModelSerializer):
    db_id = serializers.IntegerField( source='id' )

    class Meta:
        model = OpeningHours
        fields = ('id', 'day_name', 'from_time', 'until_time', 'db_id', ) 


class HoursListSerializer(serializers.ListSerializer):
    pass


class CompanySerializer(serializers.ModelSerializer):
    hours = OpeningHoursSerializer( many=True )     # similar to: openinghours_set = OpeningHoursSerializer( many=True ), see models.py
    logo_url = serializers.ReadOnlyField( source='logo_img.url' )     # CharField(read_only=True)

    class Meta:
        model = Company
        fields = ( 'id', 'company_name', 'founded_at', 'email', 'payment_method', 'subscription_plan', 
                      'logo_url', 'logo_img', 
                      'hours', 
                    )
        list_serializer_class = HoursListSerializer

    def create(self, validated_data):
        hours_data = validated_data.pop('hours')
        company = Company.objects.create(**validated_data)
        if len(hours_data) != 0:
            OpeningHours.objects.create(company=company, **hours_data)
        return company


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

"""
