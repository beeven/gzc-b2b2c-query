using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.OracleClient;

public class TaxBill
{
    public string tax_bill_id;
    public Decimal tax_total;
    public DateTime? date_of_issue;
    public List<Order> orders;
}

public class Order
{
    public string order_id;
    public string freight_id;
    public string status;
    public DateTime? last_updated;
}

public class Startup
{
    public async Task<object> Invoke(object input, object start, object end)
    {
        string criterion = (string)input;
        DateTime startDate, endDate;
        if (!DateTime.TryParse((string)start, out startDate))
        {
            startDate = DateTime.Now.Subtract(TimeSpan.FromDays(30));
        }
        if(!DateTime.TryParse((string)end, out endDate))
        {
            endDate = DateTime.Now;
        }
        
        return await Helper.Query(criterion,startDate,endDate);
    }
}

static class Helper
{
    static string connecitonString = "Data Source=10.53.1.194/ZNHG;User ID=kjecsel;Password=kjecsel;";
    public static async Task<TaxBill[]> Query(string criterion, DateTime startDate, DateTime endDate)
    {
        using(OracleConnection dbcon = new OracleConnection(connecitonString))
        {
            Dictionary<String, TaxBill> groups = new Dictionary<string, TaxBill>();
            List<TaxBill> results = new List<TaxBill>();
            await dbcon.OpenAsync();
            OracleCommand dbcmd = dbcon.CreateCommand();
            string sql = "select ORDERDOCID as \"receiver_id\", " +
                     "CHILDORDERNO as \"order_id\", " +
                     "TRANSPORT_NO as \"freight_id\", " +
                     "HANDLE_DATE as \"last_updated\", " +
                     "EBSTATUS as \"status\", " +
                     "RATEABLE_TOTAL as \"tax_total\", " +
                     "PRINT_DATE as \"date_of_issue\", " +
                     "TAX_NUMBER as \"tax_bill_id\" " +
                     "from KJECCUS.V_EBILL_FOR_WECHAT " +
                     "where ORDERDOCID = :criterion "+
                     "and ( HANDLE_DATE is null or HANDLE_DATE between :startDate and :endDate )"+
                     "order by HANDLE_DATE desc";
            dbcmd.CommandText = sql;
            dbcmd.Parameters.Add(new OracleParameter("criterion", criterion));
            dbcmd.Parameters.AddWithValue("startDate", startDate);
            dbcmd.Parameters.AddWithValue("endDate", endDate);
            OracleDataReader reader = dbcmd.ExecuteReader();
            while(await reader.ReadAsync())
            {
                string tax_bill_id = reader["tax_bill_id"] as string;
                if (tax_bill_id != null)
                {
                    if(!groups.ContainsKey(tax_bill_id))
                    {
                        groups.Add(tax_bill_id, new TaxBill() {
                            tax_bill_id = tax_bill_id,
                            date_of_issue = reader["date_of_issue"] as DateTime?,
                            tax_total = (Decimal)reader["tax_total"] ,
                            orders = new List<Order>() 
                        });
                    }
                    TaxBill tb = groups[(string)reader[7]];
                    tb.orders.Add(new Order()
                    {
                        order_id = reader["order_id"] as string,
                        freight_id = reader["freight_id"] as string,
                        status = reader["status"] as string,
                        last_updated = reader["last_updated"] as DateTime?
                    });
                }
                else
                {
                    results.Add(new TaxBill()
                    {
                        date_of_issue = reader["last_updated"] as DateTime?,
                        orders = new List<Order>() { new Order() { 
                            order_id = reader["order_id"] as string,
                            freight_id = reader["freight_id"] as string,
                            status = reader["status"] as string,
                            last_updated = reader["last_updated"] as DateTime?
                        } }
                    });
                }
            }
            reader.Close();
            dbcmd.Dispose();

            results.AddRange(groups.Values);
            return results.OrderBy(x=>x.date_of_issue).ToArray();
        }
    }
}
class Program
{
    static void Main(string[] args)
    {
        //var t = Helper.Query("320981198706300469",DateTime.Now.Subtract(TimeSpan.FromDays(30)),DateTime.Now);
        var t = Helper.Query("320981198706300469",DateTime.Now.Subtract(TimeSpan.FromDays(30)),DateTime.Now);
        t.Wait();
        var results = t.Result;
        foreach(var r in results)
        {
            Console.WriteLine("Tax_Bill_Id: {0} \t Orders: {1}", r.tax_bill_id, r.orders.Count);
        }
    }
}

