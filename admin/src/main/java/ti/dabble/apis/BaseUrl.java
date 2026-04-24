package ti.dabble.apis;


import com.google.gson.GsonBuilder;
import okhttp3.OkHttpClient;
import okhttp3.logging.HttpLoggingInterceptor;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class BaseUrl {
    private static Retrofit retrofit = null;

    public static Retrofit getClient() {
        HttpLoggingInterceptor interceptor = new HttpLoggingInterceptor();
        OkHttpClient client = new OkHttpClient.Builder().addInterceptor(interceptor).build();
        retrofit = new Retrofit.Builder()
                .baseUrl("http://27.78.77.132:3366")
                .addConverterFactory(GsonConverterFactory.create(
                        new GsonBuilder().setDateFormat("dd/MM/yyyy").create()))
                .client(client)
                .build();
        return retrofit;
    }
}
