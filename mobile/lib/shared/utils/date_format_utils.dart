import 'package:intl/intl.dart';

/// Utility class for date/time formatting using intl
class DateFormatUtils {
  DateFormatUtils._();

  /// Convert to local time before formatting
  static DateTime _toLocal(DateTime date) => date.toLocal();

  // ==================== Common Formats ====================

  /// Format: dd/MM/yyyy (e.g., 09/01/2026)
  static String formatDate(DateTime date) {
    return DateFormat('dd/MM/yyyy').format(_toLocal(date));
  }

  /// Format: dd-MM-yyyy (e.g., 09-01-2026)
  static String formatDateDash(DateTime date) {
    return DateFormat('dd-MM-yyyy').format(_toLocal(date));
  }

  /// Format: yyyy-MM-dd (e.g., 2026-01-09) - ISO format
  static String formatDateIso(DateTime date) {
    return DateFormat('yyyy-MM-dd').format(_toLocal(date));
  }

  /// Format: dd MMM yyyy (e.g., 09 Jan 2026)
  static String formatDateShort(DateTime date) {
    return DateFormat('dd MMM yyyy').format(_toLocal(date));
  }

  /// Format: dd MMMM yyyy (e.g., 09 January 2026)
  static String formatDateLong(DateTime date) {
    return DateFormat('dd MMMM yyyy').format(_toLocal(date));
  }

  /// Format: EEEE, dd MMMM yyyy (e.g., Thursday, 09 January 2026)
  static String formatDateFull(DateTime date) {
    return DateFormat('EEEE, dd MMMM yyyy').format(_toLocal(date));
  }

  // ==================== Time Formats ====================

  /// Format: HH:mm (e.g., 22:46)
  static String formatTime24(DateTime date) {
    return DateFormat('HH:mm').format(_toLocal(date));
  }

  /// Format: HH:mm:ss (e.g., 22:46:33)
  static String formatTime24WithSeconds(DateTime date) {
    return DateFormat('HH:mm:ss').format(_toLocal(date));
  }

  /// Format: hh:mm a (e.g., 10:46 PM)
  static String formatTime12(DateTime date) {
    return DateFormat('hh:mm a').format(_toLocal(date));
  }

  // ==================== DateTime Formats ====================

  /// Format: dd/MM/yyyy HH:mm (e.g., 09/01/2026 22:46)
  static String formatDateTime(DateTime date) {
    return DateFormat('dd/MM/yyyy HH:mm').format(_toLocal(date));
  }

  /// Format: dd MMM yyyy, HH:mm (e.g., 09 Jan 2026, 22:46)
  static String formatDateTimeShort(DateTime date) {
    return DateFormat('dd MMM yyyy, HH:mm').format(_toLocal(date));
  }

  /// Format: yyyy-MM-dd HH:mm:ss (ISO format)
  static String formatDateTimeIso(DateTime date) {
    return DateFormat('yyyy-MM-dd HH:mm:ss').format(_toLocal(date));
  }

  // ==================== Relative Time ====================

  /// Get relative time string (e.g., "2 hours ago", "yesterday")
  static String getRelativeTime(DateTime date) {
    final DateTime now = DateTime.now();
    final DateTime localDate = _toLocal(date);
    final Duration difference = now.difference(localDate);

    if (difference.inSeconds < 60) {
      return 'Just now';
    } else if (difference.inMinutes < 60) {
      final int minutes = difference.inMinutes;
      return '$minutes ${minutes == 1 ? 'minute' : 'minutes'} ago';
    } else if (difference.inHours < 24) {
      final int hours = difference.inHours;
      return '$hours ${hours == 1 ? 'hour' : 'hours'} ago';
    } else if (difference.inDays < 7) {
      final int days = difference.inDays;
      if (days == 1) return 'Yesterday';
      return '$days days ago';
    } else if (difference.inDays < 30) {
      final int weeks = (difference.inDays / 7).floor();
      return '$weeks ${weeks == 1 ? 'week' : 'weeks'} ago';
    } else if (difference.inDays < 365) {
      final int months = (difference.inDays / 30).floor();
      return '$months ${months == 1 ? 'month' : 'months'} ago';
    } else {
      final int years = (difference.inDays / 365).floor();
      return '$years ${years == 1 ? 'year' : 'years'} ago';
    }
  }

  /// Web-aligned timeAgo (e.g. "just now", "5 minutes", "2 days")
  static String timeAgo(DateTime date) {
    final DateTime now = DateTime.now();
    final Duration difference = now.difference(date);

    if (difference.inMinutes < 1) {
      return 'just now';
    } else if (difference.inMinutes < 60) {
      final int minutes = difference.inMinutes;
      return '$minutes ${minutes == 1 ? 'minute' : 'minutes'}';
    } else if (difference.inHours < 24) {
      final int hours = difference.inHours;
      return '$hours ${hours == 1 ? 'hour' : 'hours'}';
    } else if (difference.inDays < 7) {
      final int days = difference.inDays;
      return '$days ${days == 1 ? 'day' : 'days'}';
    } else if (difference.inDays < 28) {
      final int weeks = (difference.inDays / 7).floor();
      return '$weeks ${weeks == 1 ? 'week' : 'weeks'}';
    } else if (difference.inDays < 365) {
      final int months = (difference.inDays / 30).floor();
      return '$months ${months == 1 ? 'month' : 'months'}';
    } else {
      final int years = (difference.inDays / 365).floor();
      return '$years ${years == 1 ? 'year' : 'years'}';
    }
  }

  // ==================== Parsing ====================

  /// Parse date from string with format (returns local time)
  static DateTime? parse(String dateString, String format) {
    try {
      return DateFormat(format).parse(dateString).toLocal();
    } catch (_) {
      return null;
    }
  }

  /// Parse ISO date string (returns local time)
  static DateTime? parseIso(String dateString) {
    try {
      return DateTime.parse(dateString).toLocal();
    } catch (_) {
      return null;
    }
  }

  // ==================== Custom Format ====================

  /// Format with custom pattern
  static String format(DateTime date, String pattern) {
    return DateFormat(pattern).format(_toLocal(date));
  }

  /// Format with locale
  static String formatWithLocale(DateTime date, String pattern, String locale) {
    return DateFormat(pattern, locale).format(_toLocal(date));
  }
}
