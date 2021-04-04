
from rest_framework import viewsets
from rest_framework import generics, status
from food.models import FoodItem,FoodOrdering
from .serializers import FoodItemSerilizer,FoodOrderingSerializer,OrderItemEmbededSerializer,FoodOrderEmbededSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser,AllowAny,IsAuthenticated
from datetime import date, datetime, timedelta
from django.db.models.functions import Extract


class FoodItemView(generics.GenericAPIView):
    queryset = FoodItem.objects.all()
    permission_classes=[AllowAny]
    serializer_class = FoodItemSerilizer

    def get(self, request, *args, **kwargs):
        queryset = FoodItem.objects.all()
        serialized_data = FoodItemSerilizer(queryset, many=True)
        return Response(serialized_data.data, status=status.HTTP_200_OK)

class CreateFoodItem(generics.CreateAPIView):
    queryset=FoodItem.objects.all()
    serializer_class=FoodItemSerilizer

class FoodDeleteView(generics.DestroyAPIView):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerilizer

class FoodUpdateView(generics.UpdateAPIView):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerilizer

class OrderCancelView(generics.GenericAPIView):
    serializer_class = OrderItemEmbededSerializer
    queryset=FoodOrdering.objects.all() 
    def post(self,request,*args,**kwargs):
        order_id_list = request.data.get('order_id',None)
        try:
            for order_id in order_id_list:
                order = FoodOrdering.objects.get(id=order_id)
                order.isCancel=True
                order.save()
            return Response(data={'message : Your order cancel Successfully '},status=status.HTTP_200_OK)
        except FoodOrdering.DoesNotExist:
            return Response(data={'message : Please Select a valid food Order for canceling'},status=status.HTTP_404_NOT_FOUND)

class OrderCompleteView(generics.GenericAPIView):
    serializer_class = OrderItemEmbededSerializer
    queryset=FoodOrdering.objects.all() 
    def post(self,request,*args,**kwargs):
        order_id_list = request.data.get('order_id',None)
        try:
            for order_id in order_id_list:
                order = FoodOrdering.objects.get(id=order_id)
                order.isComplete=True
                order.save()
            return Response(data={'message : Your order Completed Successfully '},status=status.HTTP_200_OK)
        except FoodOrdering.DoesNotExist:
            return Response(data={'message : Please Select a valid food Order for completing'},status=status.HTTP_404_NOT_FOUND)


class FoodOrderingView(generics.GenericAPIView):
    serializer_class=OrderItemEmbededSerializer
    queryset=FoodOrdering.objects.all() 
    
    def get(self,request,*args,**kwargs):
        IsCancel = request.query_params.get('isCancel',None)
        IsComplete = request.query_params.get('isComplete',None)
        food_Type = request.query_params.get('food_type',None)
        date_in = request.query_params.get('date',None)

        yesterday = date.today() - timedelta(days=1) #need to check 

        if IsCancel:
            orders = FoodOrdering.objects.filter(time__gte=yesterday,isCancel=True).order_by('-time')
        elif IsComplete:
            orders = FoodOrdering.objects.filter(time__gte=yesterday,isComplete=True).order_by('-time')
        elif food_Type:
            orders = FoodOrdering.objects.filter(time__gte=yesterday,food__food_type=food_Type).order_by('-time')
        elif date_in:
            orders = FoodOrdering.objects.filter(time__startswith=date_in).order_by('-time')
        else:
            orders = FoodOrdering.objects.filter(time__gte=yesterday).order_by('-time')

        serialzer_data = self.get_serializer(orders,many=True)
        return Response(serialzer_data.data,status=status.HTTP_200_OK)
   
    def post(self,request,*args,**kwargs):
        food_id_and_quantity_list = request.data.get('foods', None)
        guest_id = request.data.get('guest_id', None)
        
       
        try:
            for food in food_id_and_quantity_list:
                select_food = FoodItem.objects.get(id=food["id"])

                if select_food.available is False:
                    return Response(data={'message :' 'Your selected food is not available'},status=status.HTTP_404_NOT_FOUND)
                
                if food["quantity"] is None :
                    return Response(data={'message :''You have to select a specific Quantity'},status=status.HTTP_404_NOT_FOUND)
                if food["price"] is None:
                    return Response(data={"message : " "You have to include the price "},status=status.HTTP_404_NOT_FOUND)
                
                
                new_order = FoodOrdering(quantity=food["quantity"],guest_id=guest_id,food_id=food["id"],order_price=food["price"])
                new_order.taken_by=request.user.id
                new_order.save()
                
            return Response(data={'message :''Your order recieved Successfully'},status=status.HTTP_200_OK)
        except FoodItem.DoesNotExist:
            return Response(data={'message : ''Please Select a valid food Item '},status=status.HTTP_404_NOT_FOUND)


class OrderInvoiceView(generics.GenericAPIView):
    serializer_class=FoodOrderEmbededSerializer

    def get(self,request,*args,**kwargs):
        guest_no = request.data.get('guest_id',None)

        try:
            order_list = FoodOrdering.objects.filter(guest_id=guest_no,isCancel=False,isComplete=True)
            serializer_data=self.get_serializer(order_list,many=True)
            return Response(data=serializer_data.data,status=status.HTTP_200_OK)

        except FoodOrdering.DoesNotExist:
            return Response(data={'message : Guest id does not exists in the Food order list..'},status=status.HTTP_404_NOT_FOUND)